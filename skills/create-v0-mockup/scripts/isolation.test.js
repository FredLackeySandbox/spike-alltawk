#!/usr/bin/env node
"use strict";

const assert = require("node:assert/strict");
const { spawn } = require("node:child_process");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const test = require("node:test");

const { buildManifest, initializeOutput } = require("./initialize-output.js");
const { buildInventory } = require("./inventory-pages.js");
const { validateOutputTree } = require("./validate-output-tree.js");

/** Create one isolated project fixture and remove only that fixture afterward. */
function projectFixture(t) {
  const projectRoot = fs.mkdtempSync(path.join(os.tmpdir(), "create-v0-isolation-"));
  t.after(() => fs.rmSync(projectRoot, { recursive: true, force: true }));
  const sourceRoot = path.join(projectRoot, "docs/mockup/desktop");
  const conceptRoot = path.join(projectRoot, "docs/concepts");
  fs.mkdirSync(path.join(sourceRoot, "assets"), { recursive: true });
  fs.mkdirSync(path.join(sourceRoot, "area"), { recursive: true });
  fs.mkdirSync(conceptRoot, { recursive: true });
  fs.writeFileSync(path.join(sourceRoot, "assets/styles.css"), "body { color: #123; }\n");
  fs.writeFileSync(path.join(sourceRoot, "assets/app.js"), "document.body.dataset.ready = '1';\n");
  fs.writeFileSync(
    path.join(sourceRoot, "area/page.html"),
    '<link rel="stylesheet" href="../assets/styles.css">\n' +
    '<a href="../index.html">Home</a>\n' +
    '<button data-action="save">Save</button>\n' +
    '<script src="../assets/app.js"></script>\n'
  );
  fs.writeFileSync(path.join(sourceRoot, "index.html"), '<a href="area/page.html">Page</a>\n');
  fs.writeFileSync(path.join(conceptRoot, "APP_PAGES.md"), "# Pages\n");
  return { projectRoot, sourceRoot, outputRoot: path.join(projectRoot, "docs/mockup/desktop-v0") };
}

test("recursively copies a complete byte-identical tree without changing the source", (t) => {
  const fixture = projectFixture(t);
  const sourceBefore = buildManifest(fixture.sourceRoot);
  const result = initializeOutput({
    projectRoot: fixture.projectRoot,
    sourceRoot: "docs/mockup/desktop",
    outputRoot: "docs/mockup/desktop-v0"
  });
  assert.equal(result.ok, true);
  assert.deepEqual(buildManifest(fixture.outputRoot), sourceBefore);
  assert.deepEqual(buildManifest(fixture.sourceRoot), sourceBefore);
  assert.equal(validateOutputTree({
    projectRoot: fixture.projectRoot,
    sourceRoot: "docs/mockup/desktop",
    outputRoot: "docs/mockup/desktop-v0"
  }).ok, true);
  assert.equal(buildInventory({
    projectRoot: fixture.projectRoot,
    sourceRoot: "docs/mockup/desktop",
    outputRoot: "docs/mockup/desktop-v0",
    pageCatalog: "docs/concepts/APP_PAGES.md"
  }).pageCount, 2);
});

test("serves the copied output tree independently with copied assets", async (t) => {
  const fixture = projectFixture(t);
  initializeOutput({
    projectRoot: fixture.projectRoot,
    sourceRoot: "docs/mockup/desktop",
    outputRoot: "docs/mockup/desktop-v0"
  });
  const server = spawn(process.execPath, [
    path.join(__dirname, "serve-project.js"),
    "--root", fixture.outputRoot,
    "--port", "0"
  ], { stdio: ["ignore", "pipe", "pipe"] });
  t.after(() => {
    if (server.exitCode === null) server.kill("SIGTERM");
  });
  const origin = await new Promise((resolve, reject) => {
    let output = "";
    server.stdout.on("data", (chunk) => {
      output += chunk.toString();
      const match = /READY (http:\/\/[^/\s]+)/.exec(output);
      if (match) resolve(match[1]);
    });
    server.stderr.on("data", (chunk) => reject(new Error(chunk.toString())));
    server.on("exit", (code) => {
      if (code && !output.includes("READY ")) reject(new Error(`server exited with ${code}`));
    });
  });
  const pageResponse = await fetch(`${origin}/area/page.html`);
  const cssResponse = await fetch(`${origin}/assets/styles.css`);
  const scriptResponse = await fetch(`${origin}/assets/app.js`);
  assert.equal(pageResponse.status, 200);
  assert.equal(cssResponse.status, 200);
  assert.equal(scriptResponse.status, 200);
});

test("refuses to merge with or overwrite an existing output tree", (t) => {
  const fixture = projectFixture(t);
  fs.mkdirSync(fixture.outputRoot, { recursive: true });
  const sentinel = path.join(fixture.outputRoot, "keep.txt");
  fs.writeFileSync(sentinel, "keep\n");
  assert.throws(() => initializeOutput({
    projectRoot: fixture.projectRoot,
    sourceRoot: "docs/mockup/desktop",
    outputRoot: "docs/mockup/desktop-v0"
  }), /refusing to merge or overwrite/);
  assert.equal(fs.readFileSync(sentinel, "utf8"), "keep\n");
});

test("rejects source symlinks instead of copying a hidden dependency", (t) => {
  const fixture = projectFixture(t);
  fs.symlinkSync(path.join(fixture.sourceRoot, "assets/styles.css"), path.join(fixture.sourceRoot, "linked.css"));
  assert.throws(() => initializeOutput({
    projectRoot: fixture.projectRoot,
    sourceRoot: "docs/mockup/desktop",
    outputRoot: "docs/mockup/desktop-v0"
  }), /Symbolic links are forbidden/);
  assert.equal(fs.existsSync(fixture.outputRoot), false);
});

test("rejects output references that escape to the source tree", (t) => {
  const fixture = projectFixture(t);
  initializeOutput({
    projectRoot: fixture.projectRoot,
    sourceRoot: "docs/mockup/desktop",
    outputRoot: "docs/mockup/desktop-v0"
  });
  fs.writeFileSync(
    path.join(fixture.outputRoot, "area/page.html"),
    '<link rel="stylesheet" href="../../desktop/assets/styles.css">\n'
  );
  const result = validateOutputTree({
    projectRoot: fixture.projectRoot,
    sourceRoot: "docs/mockup/desktop",
    outputRoot: "docs/mockup/desktop-v0"
  });
  assert.equal(result.ok, false);
  assert.match(result.errors.join("\n"), /reference escapes output root/);
});

test("rejects scripted navigation that escapes the output tree", (t) => {
  const fixture = projectFixture(t);
  initializeOutput({
    projectRoot: fixture.projectRoot,
    sourceRoot: "docs/mockup/desktop",
    outputRoot: "docs/mockup/desktop-v0"
  });
  fs.writeFileSync(
    path.join(fixture.outputRoot, "area/page.html"),
    "<script>window.location.href = '../../desktop/index.html';</script>\n"
  );
  const result = validateOutputTree({
    projectRoot: fixture.projectRoot,
    sourceRoot: "docs/mockup/desktop",
    outputRoot: "docs/mockup/desktop-v0"
  });
  assert.equal(result.ok, false);
  assert.match(result.errors.join("\n"), /reference escapes output root/);
});

test("rejects missing local page and asset targets", (t) => {
  const fixture = projectFixture(t);
  initializeOutput({
    projectRoot: fixture.projectRoot,
    sourceRoot: "docs/mockup/desktop",
    outputRoot: "docs/mockup/desktop-v0"
  });
  fs.writeFileSync(
    path.join(fixture.outputRoot, "area/page.html"),
    '<link rel="stylesheet" href="../assets/missing.css">\n' +
    '<a href="missing.html">Missing</a>\n'
  );
  const result = validateOutputTree({
    projectRoot: fixture.projectRoot,
    sourceRoot: "docs/mockup/desktop",
    outputRoot: "docs/mockup/desktop-v0"
  });
  assert.equal(result.ok, false);
  assert.equal(result.errors.filter((error) => error.includes("missing local target")).length, 2);
});
