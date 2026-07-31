#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const { execFileSync } = require("node:child_process");
const { createRequire } = require("node:module");

/** Parse this command's supported arguments. */
function parseArguments(argv) {
  const options = { projectRoot: process.cwd(), probe: false };
  for (let index = 0; index < argv.length; index += 1) {
    const value = argv[index];
    if (value === "--project-root") options.projectRoot = argv[++index];
    else if (value === "--probe") options.probe = true;
    else if (value === "--probe-output") options.probeOutput = argv[++index];
    else if (value === "--help") options.help = true;
    else throw new Error(`Unknown argument: ${value}`);
  }
  return options;
}

/** Return every directory from the starting directory through its filesystem root. */
function ancestorDirectories(startDirectory) {
  const directories = [];
  let current = path.resolve(startDirectory);
  while (true) {
    directories.push(current);
    const parent = path.dirname(current);
    if (parent === current) return directories;
    current = parent;
  }
}

/** Resolve a package from a directory without changing process-global module paths. */
function resolvePackageFrom(packageName, directory) {
  try {
    const resolver = createRequire(path.join(directory, "__playwright_resolver__.js"));
    return resolver.resolve(packageName);
  } catch {
    return null;
  }
}

/** Find the matching package root for a resolved module entry. */
function findPackageRoot(moduleEntry, packageName) {
  for (const directory of ancestorDirectories(path.dirname(moduleEntry))) {
    const manifestPath = path.join(directory, "package.json");
    if (!fs.existsSync(manifestPath)) continue;
    try {
      const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
      if (manifest.name === packageName) return { directory, manifestPath, manifest };
    } catch {
      // Continue past unrelated or malformed package metadata.
    }
  }
  return null;
}

/** Ask npm for its global module directory when npm is available. */
function globalModuleDirectories() {
  try {
    const directory = execFileSync("npm", ["root", "--global"], {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"]
    }).trim();
    return directory ? [directory] : [];
  } catch {
    return [];
  }
}

/** Locate a usable Playwright JavaScript package without relying on named environment variables. */
function locatePlaywright(projectRoot) {
  const resolvedRoot = path.resolve(projectRoot);
  if (!fs.existsSync(resolvedRoot)) throw new Error(`Project root does not exist: ${resolvedRoot}`);

  const searchDirectories = [...ancestorDirectories(resolvedRoot), ...globalModuleDirectories()];
  const packageNames = ["playwright", "@playwright/test", "playwright-core"];
  const seen = new Set();

  for (const directory of searchDirectories) {
    for (const packageName of packageNames) {
      const key = `${directory}\0${packageName}`;
      if (seen.has(key)) continue;
      seen.add(key);

      let moduleEntry = resolvePackageFrom(packageName, directory);
      if (!moduleEntry && path.basename(directory) !== "node_modules") continue;
      if (!moduleEntry) moduleEntry = resolvePackageFrom(packageName, path.dirname(directory));
      if (!moduleEntry) continue;

      try {
        const packageRoot = findPackageRoot(moduleEntry, packageName);
        if (!packageRoot) continue;
        const playwright = require(moduleEntry);
        const browsers = ["chromium", "firefox", "webkit"].flatMap((browserName) => {
          try {
            const browserType = playwright[browserName];
            if (!browserType || typeof browserType.executablePath !== "function") return [];
            const executablePath = browserType.executablePath();
            if (!executablePath || !fs.existsSync(executablePath)) return [];
            fs.accessSync(executablePath, fs.constants.X_OK);
            return [{
              candidateId: `${browserName}:managed`,
              browserName,
              executablePath,
              launchOptions: {}
            }];
          } catch {
            return [];
          }
        });

        if (playwright.chromium) {
          browsers.push(
            {
              candidateId: "chromium:chrome-channel",
              browserName: "chromium",
              executablePath: null,
              launchOptions: { channel: "chrome" }
            },
            {
              candidateId: "chromium:edge-channel",
              browserName: "chromium",
              executablePath: null,
              launchOptions: { channel: "msedge" }
            }
          );
        }

        if (browsers.length === 0) continue;
        return {
          packageName,
          version: String(packageRoot.manifest.version || "unknown"),
          moduleEntry,
          packageRoot: packageRoot.directory,
          browsers
        };
      } catch {
        // Keep searching when a resolvable installation is broken or incompatible.
      }
    }
  }

  throw new Error(
    `No Playwright package with an installed browser executable was found from ${resolvedRoot}`
  );
}

/** Launch Playwright, render content, and optionally persist the visual probe screenshot. */
async function probePlaywright(location, outputPath) {
  const playwright = require(location.moduleEntry);
  const failures = [];

  for (const browserInfo of location.browsers) {
    let browser;
    try {
      browser = await playwright[browserInfo.browserName].launch({
        headless: true,
        ...browserInfo.launchOptions
      });
      const page = await browser.newPage({ viewport: { width: 800, height: 600 } });
      await page.setContent("<!doctype html><title>probe</title><main>visual-probe-ready</main>");
      await page.getByText("visual-probe-ready").waitFor({ state: "visible" });
      const screenshot = await page.screenshot();
      if (!Buffer.isBuffer(screenshot) || screenshot.length < 100) {
        throw new Error("Playwright returned an invalid screenshot");
      }
      let screenshotPath = null;
      if (outputPath) {
        screenshotPath = path.resolve(outputPath);
        const parentDirectory = path.dirname(screenshotPath);
        if (!fs.existsSync(parentDirectory)) {
          throw new Error(`Probe output directory does not exist: ${parentDirectory}`);
        }
        fs.writeFileSync(screenshotPath, screenshot);
      }
      await browser.close();
      return {
        candidateId: browserInfo.candidateId,
        browserName: browserInfo.browserName,
        executablePath: browserInfo.executablePath,
        screenshotBytes: screenshot.length,
        screenshotPath
      };
    } catch (error) {
      if (browser) await browser.close().catch(() => {});
      failures.push(`${browserInfo.browserName}: ${error.message}`);
    }
  }

  throw new Error(`Playwright visual probe failed (${failures.join("; ")})`);
}

/** Run the Playwright discovery command. */
async function main() {
  const options = parseArguments(process.argv.slice(2));
  if (options.help) {
    process.stdout.write(
      "Usage: node find-playwright.js [--project-root PATH] [--probe] [--probe-output PNG]\n"
    );
    return;
  }

  const location = locatePlaywright(options.projectRoot);
  if (options.probeOutput && !options.probe) throw new Error("--probe-output requires --probe");
  const probe = options.probe ? await probePlaywright(location, options.probeOutput) : null;
  process.stdout.write(`${JSON.stringify({ ...location, probe }, null, 2)}\n`);
}

module.exports = { locatePlaywright, probePlaywright };

if (require.main === module) {
  main().catch((error) => {
    process.stderr.write(`BLOCKED: ${error.message}\n`);
    process.exitCode = 1;
  });
}
