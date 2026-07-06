import { test, expect } from "@playwright/test";

// End-to-end coverage of the core user journeys. Run with `npm run test:e2e`
// (Playwright starts the dev server automatically via playwright.config.ts).

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

test("builds a layout from the UI and reflects it in the code panel", async ({
  page,
}) => {
  const grid = page.getByTestId("grid-container");
  const code = page.getByTestId("code-output");

  // Default 3x3.
  await expect(code).toContainText("grid-template-columns: 1fr 1fr 1fr;");

  // Add a column via the sidebar.
  await page.getByTestId("add-column-btn").click();
  await expect(code).toContainText("grid-template-columns: 1fr 1fr 1fr 1fr;");
  await expect(grid).toHaveCSS("grid-template-columns", /.+/);

  // Add an item and confirm it appears in both the canvas and the CSS.
  await page.getByTestId("add-item-btn").click();
  await expect(
    page.getByTestId("grid-container").getByText("Item 1"),
  ).toBeVisible();
  await expect(code).toContainText(".item-1");
});

test("loads a preset and shows named areas", async ({ page }) => {
  await page.getByTestId("preset-holy-grail").click();
  const code = page.getByTestId("code-output");
  await expect(code).toContainText("grid-template-columns: 200px 1fr 200px;");
  await expect(code).toContainText("grid-template-areas:");
});

test("copies the CSS to the clipboard", async ({ page, context }) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.getByTestId("copy-btn").click();
  await expect(page.getByTestId("copy-btn")).toContainText("Copied!");

  const clipboard = await page.evaluate(() => navigator.clipboard.readText());
  expect(clipboard).toContain("display: grid;");
});

test("switches to the HTML tab and exports matching markup", async ({
  page,
}) => {
  await page.getByTestId("add-item-btn").click();
  await page.getByTestId("tab-html").click();
  await expect(page.getByTestId("code-output")).toContainText(
    '<div class="container">',
  );
  await expect(page.getByTestId("code-output")).toContainText(
    '<div class="item-1">Item 1</div>',
  );
});

test("toggles dark mode and persists it", async ({ page }) => {
  await page.getByTestId("theme-toggle").click();
  await expect(page.locator("html")).toHaveClass(/dark/);

  await page.reload();
  await expect(page.locator("html")).toHaveClass(/dark/);
});

test("undo and redo from the toolbar", async ({ page }) => {
  const code = page.getByTestId("code-output");
  await page.getByTestId("add-column-btn").click();
  await expect(code).toContainText("grid-template-columns: 1fr 1fr 1fr 1fr;");

  await page.getByTestId("undo-btn").click();
  await expect(code).toContainText("grid-template-columns: 1fr 1fr 1fr;");

  await page.getByTestId("redo-btn").click();
  await expect(code).toContainText("grid-template-columns: 1fr 1fr 1fr 1fr;");
});

test("all interactive controls are keyboard reachable", async ({ page }) => {
  // Tab into the document and ensure focus lands on a real control.
  await page.keyboard.press("Tab");
  const tag = await page.evaluate(() =>
    document.activeElement?.tagName.toLowerCase(),
  );
  expect(["button", "input", "select"]).toContain(tag);
});
