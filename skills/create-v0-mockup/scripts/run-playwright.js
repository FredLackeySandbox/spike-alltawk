#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const { locatePlaywright, probePlaywright } = require("./find-playwright.js");

/** Parse runner arguments. */
function parseArguments(argv) {
  const options = { projectRoot: process.cwd() };
  for (let index = 0; index < argv.length; index += 1) {
    const value = argv[index];
    if (value === "--project-root") options.projectRoot = argv[++index];
    else if (value === "--scenario") options.scenario = argv[++index];
    else if (value === "--browser") options.browserName = argv[++index];
    else if (value === "--help") options.help = true;
    else throw new Error(`Unknown argument: ${value}`);
  }
  return options;
}

/** Load a scenario module that exposes one async run function. */
function loadScenario(scenarioPath) {
  const absolutePath = path.resolve(scenarioPath);
  if (!fs.existsSync(absolutePath)) throw new Error(`Scenario does not exist: ${absolutePath}`);
  delete require.cache[require.resolve(absolutePath)];
  const scenario = require(absolutePath);
  if (!scenario || typeof scenario.run !== "function") {
    throw new Error("Scenario must export an async run(context) function");
  }
  return { absolutePath, run: scenario.run };
}

/** Run one temporary scenario with the discovered Playwright installation. */
async function main() {
  const options = parseArguments(process.argv.slice(2));
  if (options.help) {
    process.stdout.write(
      "Usage: node run-playwright.js --project-root PATH --scenario FILE [--browser NAME]\n"
    );
    return;
  }
  if (!options.scenario) throw new Error("--scenario is required");

  const projectRoot = path.resolve(options.projectRoot);
  const scenario = loadScenario(options.scenario);
  const location = locatePlaywright(projectRoot);
  const probe = await probePlaywright(location);
  const browserName = options.browserName || probe.browserName;
  const browserInfo = options.browserName
    ? location.browsers.find((entry) => entry.browserName === browserName)
    : location.browsers.find((entry) => entry.candidateId === probe.candidateId);
  if (!browserInfo) throw new Error(`Installed browser is unavailable: ${browserName}`);

  const playwright = require(location.moduleEntry);
  const browser = await playwright[browserName].launch({
    headless: true,
    ...browserInfo.launchOptions
  });
  try {
    await scenario.run({
      playwright,
      browser,
      browserName,
      browserInfo,
      projectRoot,
      scenarioPath: scenario.absolutePath
    });
  } finally {
    await browser.close();
  }
}

if (require.main === module) {
  main().catch((error) => {
    process.stderr.write(`${error.stack || error.message}\n`);
    process.exitCode = 1;
  });
}
