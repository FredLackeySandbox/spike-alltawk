#!/usr/bin/env node
"use strict";

const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");

/** Parse inventory arguments. */
function parseArguments(argv) {
  const options = {
    projectRoot: process.cwd(),
    sourceRoot: "docs/mockup/desktop",
    outputRoot: "docs/mockup/desktop-v0",
    pageCatalog: "docs/concepts/APP_PAGES.md"
  };
  for (let index = 0; index < argv.length; index += 1) {
    const value = argv[index];
    if (value === "--project-root") options.projectRoot = argv[++index];
    else if (value === "--source-root") options.sourceRoot = argv[++index];
    else if (value === "--output-root") options.outputRoot = argv[++index];
    else if (value === "--page-catalog") options.pageCatalog = argv[++index];
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

/** Resolve symlinks in an existing path or its nearest existing ancestor. */
function canonicalizePath(candidatePath) {
  const remainder = [];
  let existingPath = candidatePath;
  while (!fs.existsSync(existingPath)) {
    const parentPath = path.dirname(existingPath);
    if (parentPath === existingPath) throw new Error(`No existing ancestor for path: ${candidatePath}`);
    remainder.unshift(path.basename(existingPath));
    existingPath = parentPath;
  }
  return path.join(fs.realpathSync(existingPath), ...remainder);
}

/** Resolve a project path and reject lexical or symlink escape. */
function resolveProjectPath(projectRoot, candidate) {
  const lexicalPath = path.resolve(projectRoot, candidate);
  if (!containsPath(projectRoot, lexicalPath)) {
    throw new Error(`Path escapes project root: ${candidate}`);
  }
  const canonicalPath = canonicalizePath(lexicalPath);
  if (!containsPath(projectRoot, canonicalPath)) {
    throw new Error(`Path escapes project root through a symlink: ${candidate}`);
  }
  return canonicalPath;
}

/** Recursively list HTML files without opening or analyzing them. */
function listHtmlFiles(directory) {
  const results = [];
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const absolutePath = path.join(directory, entry.name);
    if (entry.isDirectory()) results.push(...listHtmlFiles(absolutePath));
    else if (entry.isFile() && entry.name.toLowerCase().endsWith(".html")) {
      results.push(absolutePath);
    }
  }
  return results.sort((left, right) => left.localeCompare(right));
}

/** Compute a stable source-integrity hash. */
function sha256(filePath) {
  return crypto.createHash("sha256").update(fs.readFileSync(filePath)).digest("hex");
}

/** Hash text or binary content already held in memory. */
function sha256Value(value) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

/** Hash a file, symlink target, or directory tree while breaking symlink cycles. */
function hashPathContent(candidatePath, ancestors = new Set()) {
  const metadata = fs.lstatSync(candidatePath);
  if (metadata.isSymbolicLink()) {
    const linkTarget = fs.readlinkSync(candidatePath);
    try {
      const realTarget = fs.realpathSync(candidatePath);
      return sha256Value(`symlink:${linkTarget}:${hashPathContent(realTarget, ancestors)}`);
    } catch {
      return sha256Value(`broken-symlink:${linkTarget}`);
    }
  }
  if (metadata.isFile()) return sha256(candidatePath);
  if (!metadata.isDirectory()) return sha256Value(`special:${metadata.mode}:${metadata.size}`);

  const realDirectory = fs.realpathSync(candidatePath);
  if (ancestors.has(realDirectory)) return sha256Value(`cycle:${realDirectory}`);
  const nextAncestors = new Set(ancestors).add(realDirectory);
  const childHashes = fs.readdirSync(candidatePath)
    .sort((left, right) => left.localeCompare(right))
    .map((name) => `${name}:${hashPathContent(path.join(candidatePath, name), nextAncestors)}`);
  return sha256Value(`directory:${childHashes.join("|")}`);
}

/** Recursively inventory project entries, treating symlinks as protected entries. */
function listIntegrityEntries(directory, options = {}) {
  const excludedPaths = options.excludedPaths || [];
  const excludedDirectoryNames = options.excludedDirectoryNames || new Set();
  const results = [];

  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const absolutePath = path.join(directory, entry.name);
    if (excludedPaths.some((excludedPath) => containsPath(excludedPath, absolutePath))) continue;
    if (entry.isDirectory() && excludedDirectoryNames.has(entry.name)) continue;

    if (entry.isDirectory()) {
      results.push(...listIntegrityEntries(absolutePath, options));
    } else {
      results.push({
        path: absolutePath,
        kind: entry.isSymbolicLink() ? "symlink" : entry.isFile() ? "file" : "special",
        sha256: hashPathContent(absolutePath)
      });
    }
  }
  return results.sort((left, right) => left.path.localeCompare(right.path));
}

/** Build the immutable page assignment inventory. */
function buildInventory(options) {
  const requestedProjectRoot = path.resolve(options.projectRoot);
  if (!fs.existsSync(requestedProjectRoot)) {
    throw new Error(`Project root does not exist: ${requestedProjectRoot}`);
  }
  const projectRoot = fs.realpathSync(requestedProjectRoot);
  if (!fs.statSync(projectRoot).isDirectory()) throw new Error(`Invalid project root: ${projectRoot}`);
  const sourceRoot = resolveProjectPath(projectRoot, options.sourceRoot);
  const lexicalOutputRoot = path.resolve(projectRoot, options.outputRoot);
  const outputRoot = resolveProjectPath(projectRoot, options.outputRoot);
  const pageCatalog = resolveProjectPath(projectRoot, options.pageCatalog);

  if (!fs.existsSync(sourceRoot)) throw new Error(`Source root does not exist: ${sourceRoot}`);
  if (!fs.statSync(sourceRoot).isDirectory()) throw new Error(`Source root is not a directory: ${sourceRoot}`);
  if (!fs.existsSync(outputRoot)) {
    throw new Error(`Output root does not exist; run initialize-output.js first: ${outputRoot}`);
  }
  if (!fs.statSync(outputRoot).isDirectory()) throw new Error(`Output root is not a directory: ${outputRoot}`);
  if (!fs.existsSync(pageCatalog)) throw new Error(`Page catalog does not exist: ${pageCatalog}`);
  if (path.normalize(lexicalOutputRoot) !== path.normalize(outputRoot)) {
    throw new Error("Output root must not traverse a symbolic link");
  }
  if (containsPath(sourceRoot, outputRoot) || containsPath(outputRoot, sourceRoot)) {
    throw new Error("Source and output roots must be separate, non-overlapping directories");
  }

  const protectedFiles = listIntegrityEntries(projectRoot, {
    excludedPaths: [outputRoot],
    excludedDirectoryNames: new Set([".git", "node_modules"])
  }).map((entry) => ({
    ...entry,
    projectRelativePath: path.relative(projectRoot, entry.path).split(path.sep).join("/")
  }));
  const outputFiles = fs.existsSync(outputRoot)
    ? listIntegrityEntries(outputRoot).map((entry) => ({
      ...entry,
      outputRelativePath: path.relative(outputRoot, entry.path).split(path.sep).join("/")
    }))
    : [];

  const pages = listHtmlFiles(sourceRoot).map((sourceHtml) => {
    const relativeHtml = path.relative(sourceRoot, sourceHtml).split(path.sep).join("/");
    const parsed = path.posix.parse(relativeHtml);
    const relativeStem = path.posix.join(parsed.dir, parsed.name);
    const outputHtml = path.join(outputRoot, ...relativeHtml.split("/"));
    if (!fs.existsSync(outputHtml) || !fs.statSync(outputHtml).isFile()) {
      throw new Error(`Copied output HTML is missing: ${outputHtml}`);
    }
    return {
      relativeHtml,
      sourceHtml,
      sourceSha256: sha256(sourceHtml),
      outputHtml,
      outputApi: path.join(outputRoot, ...`${relativeStem}-api.js`.split("/")),
      outputData: path.join(outputRoot, ...`${relativeStem}-data.json`.split("/"))
    };
  });

  if (pages.length === 0) throw new Error(`No HTML pages found under ${sourceRoot}`);
  return {
    projectRoot,
    sourceRoot,
    outputRoot,
    pageCatalog,
    protectedFileCount: protectedFiles.length,
    protectedFiles,
    outputFileCount: outputFiles.length,
    outputFiles,
    pageCount: pages.length,
    pages
  };
}

/** Run the inventory command. */
function main() {
  const options = parseArguments(process.argv.slice(2));
  if (options.help) {
    process.stdout.write(
      "Usage: node inventory-pages.js [--project-root PATH] [--source-root PATH] " +
      "[--output-root PATH] [--page-catalog PATH]\n"
    );
    return;
  }
  process.stdout.write(`${JSON.stringify(buildInventory(options), null, 2)}\n`);
}

module.exports = { buildInventory };

if (require.main === module) {
  try {
    main();
  } catch (error) {
    process.stderr.write(`BLOCKED: ${error.message}\n`);
    process.exitCode = 1;
  }
}
