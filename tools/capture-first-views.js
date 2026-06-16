"use strict";

const fs = require("node:fs");
const path = require("node:path");
const { chromium } = require("playwright");

const root = path.resolve(__dirname, "..");
const examplesPath = path.join(root, "data", "examples.json");
const examples = JSON.parse(fs.readFileSync(examplesPath, "utf8"));
const viewport = { width: 1440, height: 900 };
const waitAfterLoadMs = Number(process.env.SCREENSHOT_WAIT_MS || 1200);

function assertInsideRoot(filePath) {
  const resolved = path.resolve(filePath);
  if (!resolved.startsWith(root + path.sep)) {
    throw new Error(`Refusing to write outside repository: ${resolved}`);
  }
  return resolved;
}

async function capture(page, item) {
  const outputPath = assertInsideRoot(path.join(root, item.screenshot));
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });

  console.log(`Capturing ${item.id}: ${item.url}`);
  await page.goto(item.url, { waitUntil: "domcontentloaded", timeout: 60000 });
  await page.waitForLoadState("networkidle", { timeout: 12000 }).catch(() => {});
  await page.addStyleTag({
    content: `
      * {
        scroll-behavior: auto !important;
        transition-duration: 0s !important;
        animation-duration: 0s !important;
        animation-delay: 0s !important;
      }
    `
  }).catch(() => {});
  await page.waitForTimeout(waitAfterLoadMs);
  await page.screenshot({ path: outputPath, fullPage: false });
}

(async () => {
  const targets = examples.filter((item) => item.url && item.screenshot);
  const browser = await chromium.launch();
  const page = await browser.newPage({
    viewport,
    deviceScaleFactor: 1
  });

  try {
    for (const item of targets) {
      await capture(page, item);
    }
  } finally {
    await browser.close();
  }

  console.log(`Captured ${targets.length} first-view screenshots.`);
})().catch((error) => {
  console.error(error);
  process.exit(1);
});

