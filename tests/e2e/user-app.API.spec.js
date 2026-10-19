import { test, expect } from "@playwright/test";

test.describe("User Application E2E", () => {

  test("should load a random user on startup", async ({ page }) => {

    await page.goto("http://localhost:3000");
    await expect(page.locator("#welcomeUser")).toContainText("Welcome");

    const cards = page.locator("#cards");

    await expect(cards).not.toBeEmpty();
    await expect(cards).toContainText("UserId:");
    await expect(cards).toContainText("Name:");
    await expect(cards).toContainText("UserName:");
    await expect(cards).toContainText("EmailId:");
  });

  test("should fetch user id 1", async ({ page }) => {

  await page.goto("http://localhost:3000");
  await page.fill("#userId", "1");

  const responsePromise = page.waitForResponse( response => response.url().includes("/api/filter?id=1") && response.status() === 200 );

  await page.click(".form-submit");
  await responsePromise;

  await expect(page.locator("#cards")).toContainText("Leanne Graham");

});

  test("should clear input after submit", async ({ page }) => {

    await page.goto("http://localhost:3000");
    await page.fill("#userId", "1");
    await page.click(".form-submit");
    await expect(page.locator("#userId")).toHaveValue("");
  });

  test("should display user info for user 1", async ({ page }) => {

    await page.goto("http://localhost:3000");
    await page.fill("#userId", "1");
    await page.click(".form-submit");
    await expect(page.locator("#cards")).toContainText("Kulas Light");
    await expect(page.locator("#cards")).toContainText("92998-3874");
    await expect(page.locator("#cards")).toContainText("1-770-736-8031");
    await expect(page.locator("#cards")).toContainText("hildegard.org");
    await expect(page.locator("#cards")).toContainText("Romaguera-Crona");
  });

  test("should show 404 user not found", async ({ page }) => {

    await page.goto("http://localhost:3000");
    await page.fill("#userId", "999");
    await page.click(".form-submit");
    await expect(page.locator(".tag-error")).toContainText("We couldn't load the user details. Error code: 404.");
    await expect(page.locator("#retry")).toBeVisible();
  });

  test("should show 404 validation error", async ({ page }) => {

    await page.goto("http://localhost:3000");
    await page.fill("#userId", "abc");
    await page.click(".form-submit");
    await expect(page.locator(".tag-error")).toContainText("Invalid User ID. User ID should be number.");
  });

  test("should retry after user not found", async ({ page }) => {

    await page.goto("http://localhost:3000");
    await page.fill("#userId", "999");
    await page.click(".form-submit");
    await expect(page.locator("#retry")).toBeVisible();
    await page.click("#retry");
    await expect(page.locator("#welcomeUser")).toContainText("Welcome");
    await expect(page.locator("#cards")).toContainText("Name:");
  });

  test("should show loading spinner during request", async ({ page }) => {

    await page.goto("http://localhost:3000");
    const spinner = page.locator("#loading");
    await expect(spinner).toHaveClass(/hidden/);
  });

  test("should send filter request for user id 1", async ({ page }) => {

    await page.goto("http://localhost:3000");

    const requestPromise = page.waitForRequest(request => request.url().includes("/api/filter?id=1"));

    await page.fill("#userId", "1");
    await page.click(".form-submit");

    const request = await requestPromise;

    expect(request.method()).toBe("GET");
    expect(request.url()).toContain("/api/filter?id=1");
  });

});