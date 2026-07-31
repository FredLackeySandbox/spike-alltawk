"use strict";

const VIEWPORTS = [
  { width: 1280, height: 800 },
  { width: 1440, height: 1000 }
];

/** Run one project-specific visual interaction scenario at both required viewports. */
async function run({ browser, projectRoot }) {
  for (const viewport of VIEWPORTS) {
    const context = await browser.newContext({ viewport, reducedMotion: "reduce" });
    const page = await context.newPage();

    page.on("console", (message) => {
      if (message.type() === "error") console.error(message.text());
    });
    page.on("pageerror", (error) => console.error(error.stack || error.message));

    // Replace with paired source/output URLs, complete state interactions,
    // assertions, and temporary screenshot paths for exactly one assigned page.
    void projectRoot;
    await page.goto("about:blank");

    await context.close();
  }
}

module.exports = { run };
