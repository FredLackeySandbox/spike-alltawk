#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const EXTERNAL_SCHEME = /^[A-Za-z][A-Za-z\d+.-]*:/;

/** Parse validation arguments. */
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

/** Recursively collect regular files while rejecting symbolic links. */
function listFiles(root, errors) {
  const results = [];
  function visit(directory) {
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
      const absolutePath = path.join(directory, entry.name);
      const relativePath = path.relative(root, absolutePath).split(path.sep).join("/");
      if (entry.isSymbolicLink()) errors.push(`symbolic link is forbidden: ${relativePath}`);
      else if (entry.isDirectory()) visit(absolutePath);
      else if (entry.isFile()) results.push(absolutePath);
      else errors.push(`special file is forbidden: ${relativePath}`);
    }
  }
  visit(root);
  return results.sort((left, right) => left.localeCompare(right));
}

/** Extract local resource and navigation references from HTML, CSS, and JavaScript. */
function extractReferences(filePath, source) {
  const references = [];
  const extension = path.extname(filePath).toLowerCase();
  if (extension === ".html") {
    for (const match of source.matchAll(/[\s<](?:href|src|action|poster)\s*=\s*["']([^"']*)["']/gi)) {
      references.push(match[1]);
    }
    for (const match of source.matchAll(/[\s<]srcset\s*=\s*["']([^"']*)["']/gi)) {
      for (const candidate of match[1].split(",")) references.push(candidate.trim().split(/\s+/)[0]);
    }
  }
  if (extension === ".html" || extension === ".css") {
    for (const match of source.matchAll(/url\(\s*["']?([^"')]+)["']?\s*\)/gi)) references.push(match[1]);
    for (const match of source.matchAll(/@import\s+(?:url\(\s*)?["']([^"']+)["']/gi)) references.push(match[1]);
  }
  if ([".html", ".js", ".mjs", ".cjs"].includes(extension)) {
    const scriptPatterns = [
      /\bfetch\s*\(\s*["'`]([^"'`$]+)["'`]/g,
      /\bimport\s*\(\s*["'`]([^"'`$]+)["'`]/g,
      /\bfrom\s+["'`]([^"'`$]+)["'`]/g,
      /\bnew\s+(?:Worker|SharedWorker)\s*\(\s*["'`]([^"'`$]+)["'`]/g,
      /\b(?:window\.)?location(?:\.href)?\s*=\s*["'`]([^"'`$]+)["'`]/g,
      /\b(?:window\.)?location\.(?:assign|replace)\s*\(\s*["'`]([^"'`$]+)["'`]/g,
      /\bwindow\.open\s*\(\s*["'`]([^"'`$]+)["'`]/g,
      /\bsetAttribute\s*\(\s*["'](?:href|src|action|poster)["']\s*,\s*["'`]([^"'`$]+)["'`]/g
    ];
    for (const pattern of scriptPatterns) {
      for (const match of source.matchAll(pattern)) references.push(match[1]);
    }
  }
  return references;
}

/** Convert a local URL to the file it must resolve to under the standalone root. */
function resolveReference(outputRoot, ownerPath, reference) {
  const trimmed = reference.trim();
  if (!trimmed || trimmed.startsWith("#") || trimmed.startsWith("data:") || trimmed.startsWith("blob:")) {
    return { ignored: true };
  }
  if (trimmed.startsWith("//") || EXTERNAL_SCHEME.test(trimmed)) return { external: true };
  let pathname;
  try {
    pathname = decodeURIComponent(trimmed.split("#")[0].split("?")[0]);
  } catch {
    return { invalid: true };
  }
  if (!pathname) return { ignored: true };
  const candidate = pathname.startsWith("/")
    ? path.resolve(outputRoot, `.${pathname}`)
    : path.resolve(path.dirname(ownerPath), pathname);
  const target = fs.existsSync(candidate) && fs.statSync(candidate).isDirectory()
    ? path.join(candidate, "index.html")
    : candidate;
  return { target };
}

/** Validate that an output tree is physically and referentially self-contained. */
function validateOutputTree(options) {
  const projectRoot = fs.realpathSync(path.resolve(options.projectRoot));
  const sourceRoot = path.resolve(projectRoot, options.sourceRoot);
  const outputRoot = path.resolve(projectRoot, options.outputRoot);
  const errors = [];
  if (!containsPath(projectRoot, sourceRoot) || !containsPath(projectRoot, outputRoot)) {
    return { ok: false, errors: ["source and output roots must stay inside the project root"] };
  }
  if (!fs.existsSync(outputRoot) || !fs.statSync(outputRoot).isDirectory()) {
    return { ok: false, errors: [`output root does not exist: ${outputRoot}`] };
  }
  if (fs.lstatSync(outputRoot).isSymbolicLink() || fs.realpathSync(outputRoot) !== outputRoot) {
    errors.push("output root must not be or traverse a symbolic link");
  }
  if (containsPath(sourceRoot, outputRoot) || containsPath(outputRoot, sourceRoot)) {
    errors.push("source and output roots must be separate, non-overlapping directories");
  }

  const files = listFiles(outputRoot, errors);
  let referenceCount = 0;
  for (const filePath of files) {
    const extension = path.extname(filePath).toLowerCase();
    if (![".html", ".css", ".js", ".mjs", ".cjs"].includes(extension)) continue;
    const owner = path.relative(outputRoot, filePath).split(path.sep).join("/");
    const source = fs.readFileSync(filePath, "utf8");
    for (const reference of extractReferences(filePath, source)) {
      referenceCount += 1;
      const resolved = resolveReference(outputRoot, filePath, reference);
      if (resolved.ignored) continue;
      if (resolved.external) {
        errors.push(`${owner}: external reference is forbidden: ${reference}`);
        continue;
      }
      if (resolved.invalid) {
        errors.push(`${owner}: invalid encoded reference: ${reference}`);
        continue;
      }
      if (!containsPath(outputRoot, resolved.target)) {
        errors.push(`${owner}: reference escapes output root: ${reference}`);
        continue;
      }
      if (containsPath(sourceRoot, resolved.target)) {
        errors.push(`${owner}: reference resolves into source root: ${reference}`);
        continue;
      }
      if (!fs.existsSync(resolved.target) || !fs.statSync(resolved.target).isFile()) {
        errors.push(`${owner}: missing local target for ${reference}`);
      }
    }
  }

  return {
    ok: errors.length === 0,
    errors,
    outputRoot,
    fileCount: files.length,
    referenceCount
  };
}

/** Run the standalone-tree validation command. */
function main() {
  const options = parseArguments(process.argv.slice(2));
  if (options.help) {
    process.stdout.write(
      "Usage: node validate-output-tree.js [--project-root PATH] [--source-root PATH] [--output-root PATH]\n"
    );
    return;
  }
  const result = validateOutputTree(options);
  process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
  if (!result.ok) process.exitCode = 1;
}

module.exports = { extractReferences, resolveReference, validateOutputTree };

if (require.main === module) {
  try {
    main();
  } catch (error) {
    process.stderr.write(`BLOCKED: ${error.message}\n`);
    process.exitCode = 1;
  }
}
