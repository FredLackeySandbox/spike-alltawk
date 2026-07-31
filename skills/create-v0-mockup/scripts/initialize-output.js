#!/usr/bin/env node
"use strict";

const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");

/** Parse initialization arguments. */
function parseArguments(argv) {
  const options = {
    projectRoot: process.cwd(),
    sourceRoot: "docs/mockup/desktop",
    outputRoot: "docs/mockup/desktop-v0"
  };
  for (let index = 0; index < argv.length; index += 1) {
    const value = argv[index];
    if (value === "--project-root") options.projectRoot = argv[++index];
    else if (value === "--source-root") options.sourceRoot = argv[++index];
    else if (value === "--output-root") options.outputRoot = argv[++index];
    else if (value === "--help") options.help = true;
    else throw new Error(`Unknown argument: ${value}`);
  }
  return options;
}

/** Return whether a candidate is equal to or nested beneath a parent path. */
function containsPath(parentPath, candidatePath) {
  const relativePath = path.relative(parentPath, candidatePath);
  return relativePath === "" || (
    relativePath !== ".." &&
    !relativePath.startsWith(`..${path.sep}`) &&
    !path.isAbsolute(relativePath)
  );
}

/** Return whether a path exists, including a broken symbolic link. */
function pathEntryExists(candidatePath) {
  try {
    fs.lstatSync(candidatePath);
    return true;
  } catch (error) {
    if (error.code === "ENOENT") return false;
    throw error;
  }
}

/** Resolve a missing path through its nearest existing real ancestor. */
function canonicalizeMissingPath(candidatePath) {
  const remainder = [];
  let existingPath = candidatePath;
  while (!pathEntryExists(existingPath)) {
    const parentPath = path.dirname(existingPath);
    if (parentPath === existingPath) throw new Error(`No existing ancestor for path: ${candidatePath}`);
    remainder.unshift(path.basename(existingPath));
    existingPath = parentPath;
  }
  return path.join(fs.realpathSync(existingPath), ...remainder);
}

/** Compute a stable file-content hash. */
function sha256(filePath) {
  return crypto.createHash("sha256").update(fs.readFileSync(filePath)).digest("hex");
}

/** Build a complete manifest while rejecting links and special files. */
function buildManifest(root) {
  const entries = [];
  function visit(directory) {
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
      const absolutePath = path.join(directory, entry.name);
      const relativePath = path.relative(root, absolutePath).split(path.sep).join("/");
      if (entry.isSymbolicLink()) {
        throw new Error(`Symbolic links are forbidden in the copied tree: ${relativePath}`);
      }
      if (entry.isDirectory()) {
        entries.push({ path: relativePath, kind: "directory" });
        visit(absolutePath);
      } else if (entry.isFile()) {
        entries.push({ path: relativePath, kind: "file", sha256: sha256(absolutePath) });
      } else {
        throw new Error(`Special files are forbidden in the copied tree: ${relativePath}`);
      }
    }
  }
  visit(root);
  return entries.sort((left, right) => left.path.localeCompare(right.path));
}

/** Create an isolated, byte-identical recursive output copy. */
function initializeOutput(options) {
  const requestedProjectRoot = path.resolve(options.projectRoot);
  if (!pathEntryExists(requestedProjectRoot)) {
    throw new Error(`Project root does not exist: ${requestedProjectRoot}`);
  }
  const projectRoot = fs.realpathSync(requestedProjectRoot);
  if (!fs.statSync(projectRoot).isDirectory()) throw new Error(`Invalid project root: ${projectRoot}`);

  const lexicalSourceRoot = path.resolve(projectRoot, options.sourceRoot);
  const lexicalOutputRoot = path.resolve(projectRoot, options.outputRoot);
  if (!containsPath(projectRoot, lexicalSourceRoot) || !containsPath(projectRoot, lexicalOutputRoot)) {
    throw new Error("Source and output roots must stay inside the project root");
  }
  if (!pathEntryExists(lexicalSourceRoot)) throw new Error(`Source root does not exist: ${lexicalSourceRoot}`);
  if (fs.lstatSync(lexicalSourceRoot).isSymbolicLink()) {
    throw new Error(`Source root must not be a symbolic link: ${lexicalSourceRoot}`);
  }
  const sourceRoot = fs.realpathSync(lexicalSourceRoot);
  if (path.normalize(sourceRoot) !== path.normalize(lexicalSourceRoot)) {
    throw new Error("Source root must not traverse a symbolic link");
  }
  if (!fs.statSync(sourceRoot).isDirectory()) throw new Error(`Source root is not a directory: ${sourceRoot}`);
  const outputRoot = canonicalizeMissingPath(lexicalOutputRoot);
  if (path.normalize(outputRoot) !== path.normalize(lexicalOutputRoot)) {
    throw new Error("Output root must not traverse a symbolic link");
  }
  if (containsPath(sourceRoot, outputRoot) || containsPath(outputRoot, sourceRoot)) {
    throw new Error("Source and output roots must be separate, non-overlapping directories");
  }
  if (pathEntryExists(outputRoot)) {
    throw new Error(`Output root already exists; refusing to merge or overwrite: ${outputRoot}`);
  }

  const sourceBefore = buildManifest(sourceRoot);
  fs.cpSync(sourceRoot, outputRoot, {
    recursive: true,
    errorOnExist: true,
    force: false,
    preserveTimestamps: true
  });
  const outputManifest = buildManifest(outputRoot);
  const sourceAfter = buildManifest(sourceRoot);
  if (JSON.stringify(sourceAfter) !== JSON.stringify(sourceBefore)) {
    throw new Error("Source tree changed during initialization");
  }
  if (JSON.stringify(outputManifest) !== JSON.stringify(sourceBefore)) {
    throw new Error("Output tree is not a byte-identical recursive copy of the source tree");
  }

  return {
    ok: true,
    projectRoot,
    sourceRoot,
    outputRoot,
    copiedEntryCount: outputManifest.length,
    copiedFileCount: outputManifest.filter((entry) => entry.kind === "file").length,
    copiedDirectoryCount: outputManifest.filter((entry) => entry.kind === "directory").length
  };
}

/** Run the initialization command. */
function main() {
  const options = parseArguments(process.argv.slice(2));
  if (options.help) {
    process.stdout.write(
      "Usage: node initialize-output.js [--project-root PATH] [--source-root PATH] [--output-root PATH]\n"
    );
    return;
  }
  process.stdout.write(`${JSON.stringify(initializeOutput(options), null, 2)}\n`);
}

module.exports = { buildManifest, initializeOutput };

if (require.main === module) {
  try {
    main();
  } catch (error) {
    process.stderr.write(`BLOCKED: ${error.message}\n`);
    process.exitCode = 1;
  }
}
