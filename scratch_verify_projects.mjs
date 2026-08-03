import { chromium } from "playwright-core";

const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";

const run = async () => {
  const browser = await chromium.launch({
    executablePath: CHROME_PATH,
    headless: true,
  });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  const consoleErrors = [];
  page.on("console", (msg) => {
    if (msg.type() === "error") consoleErrors.push(msg.text());
  });
  page.on("pageerror", (err) => consoleErrors.push("pageerror: " + err.message));

  await page.goto("http://localhost:3001/projects", { waitUntil: "networkidle", timeout: 60000 });

  // Wait out the mandatory ~2s IntroLoader
  await page.waitForTimeout(3000);
  await page.waitForSelector("text=Recent Government Contracts", { timeout: 15000 });

  await page.screenshot({ path: "scratch_projects_full.png", fullPage: true });

  const checks = {};
  checks.heroHeading = await page.locator("text=Our Projects").count();
  checks.heroLabel = await page.locator("text=Government Contracts").count();
  checks.govClients = await page.locator("text=Education Engineering Department").count();
  checks.contractsTable = await page.locator("table").count();
  checks.contractRows = await page.locator("table tbody tr").count();
  checks.featuredHeading = await page.locator("text=Featured Government Projects").count();
  checks.workCategories = await page.locator("text=Our Work Categories").count();
  checks.timeline = await page.locator("text=Our Project Timeline").count();
  checks.ctaHeading = await page.locator("text=Let's Build a Better Tomorrow Together").count();
  checks.statsLabel = await page.locator("text=Completed Projects").count();

  console.log("CHECKS:", JSON.stringify(checks, null, 2));

  // Click the first "view" eye icon in the contracts table
  const viewButtons = page.locator("table tbody button");
  const viewCount = await viewButtons.count();
  if (viewCount > 0) {
    await viewButtons.first().click();
    await page.waitForTimeout(500);
    const modalVisible = await page.locator("text=Contract No.").count();
    console.log("Modal opened after table view click, 'Contract No.' visible count:", modalVisible);
    await page.screenshot({ path: "scratch_projects_modal.png" });
    // close modal
    const closeBtn = page.locator("button:has(svg)").first();
  }

  console.log("CONSOLE ERRORS:", JSON.stringify(consoleErrors, null, 2));

  await browser.close();
};

run().catch((err) => {
  console.error("SCRIPT FAILED:", err);
  process.exit(1);
});
