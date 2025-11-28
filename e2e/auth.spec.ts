import { test, expect } from "@playwright/test";

test.describe("Authentication", () => {
  test("should display landing page", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("text=CreatorSpace")).toBeVisible();
    await expect(page.locator("text=AI-Powered Cofounder")).toBeVisible();
  });

  test("should navigate to signup page", async ({ page }) => {
    await page.goto("/");
    await page.click("text=Get Started");
    await expect(page).toHaveURL(/.*signup/);
    await expect(page.locator("text=Create your account")).toBeVisible();
  });

  test("should navigate to login page", async ({ page }) => {
    await page.goto("/");
    await page.click("text=Login");
    await expect(page).toHaveURL(/.*login/);
    await expect(page.locator("text=Welcome back")).toBeVisible();
  });
});

