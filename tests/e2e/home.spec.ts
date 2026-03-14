import { expect, test } from "@playwright/test";

test("landing page renders hero", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByText("Compare quick-commerce carts before hidden fees eat your savings.")).toBeVisible();
});
