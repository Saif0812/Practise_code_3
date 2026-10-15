import { test, expect } from "@playwright/test";

const mockUser = {
  id: 1,
  name: "Leanne Graham",
  username: "Bret",
  email: "Sincere@april.biz",
  phone: "1-770-736-8031 x56442",
  website: "hildegard.org",
  address: {
    street: "Kulas Light",
    suite: "Apt. 556",
    city: "Gwenborough",
    zipcode: "92998-3874"
  },
  company: {
    name: "Romaguera-Crona"
  }
};

test.beforeEach(async ({ page }) => {

  /*
   * Initial page load
   * fetchRandom()
   */
  await page.route("**/api/random", async route => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(mockUser)
    });
  });

  /*
   * Welcome API
   */
  await page.route("**/api/welcome", async route => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        message: `Welcome ${mockUser.name}`
      })
    });
  });
});

test.describe("User Application", () => {

  test("should load random user on startup", async ({ page }) => {

    await page.goto("http://localhost:3000");
    await expect(page.locator("#welcomeUser")).toHaveText("Welcome Leanne Graham");
    await expect(page.locator("#cards")).toContainText("Leanne Graham");
    await expect(page.locator("#cards")).toContainText("Bret");
    await expect(page.locator("#cards")).toContainText("Sincere@april.biz");
    await expect(page.locator("#cards")).toContainText("Romaguera-Crona");
  });

  test("should fetch user by id", async ({ page }) => {

    await page.route("**/api/filter?id=1", async route => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(mockUser)
      });
    });

    await page.goto("http://localhost:3000");
    await page.fill("#userId", "1");
    await page.click(".form-submit");
    await expect(page.locator("#welcomeUser")).toHaveText("Welcome Leanne Graham");
    await expect(page.locator("#cards")).toContainText("UserId:");
    await expect(page.locator("#cards")).toContainText("1");
  });

  test("should clear input after submit", async ({ page }) => {

    await page.route("**/api/filter?id=1", async route => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(mockUser)
      });
    });

    await page.goto("http://localhost:3000");
    await page.fill("#userId", "1");
    await page.click(".form-submit");
    await expect(page.locator("#userId")).toHaveValue("");
  });

  test("should display user address", async ({ page }) => {

    await page.route("**/api/filter?id=1", async route => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(mockUser)
      });
    });

    await page.goto("http://localhost:3000");
    await page.fill("#userId", "1");
    await page.click(".form-submit");
    await expect(page.locator("#cards")).toContainText("Kulas Light");
    await expect(page.locator("#cards")).toContainText("92998-3874");
  });

  test("should display 404 error when user is not found", async ({ page }) => {

    await page.route("**/api/filter?id=999", async route => {
      await route.fulfill({
        status: 404,
        contentType: "application/json",
        body: JSON.stringify({
          error: "User not found."
        })
      });
    });

    await page.goto("http://localhost:3000");
    await page.fill("#userId", "999");
    await page.click(".form-submit");
    await expect(page.locator(".tag-error")).toHaveText("We couldn't load the user details. Error code: 404.");
    await expect(page.locator("#retry")).toBeVisible();
  });

  test("should display 400 error when user id is invalid", async ({ page }) => {

    await page.route("**/api/filter?id=NaN", async route => {
      await route.fulfill({
        status: 400,
        contentType: "application/json",
        body: JSON.stringify({
          error: "Invalid User ID"
        })
      });
    });

    await page.goto("http://localhost:3000");
    await page.fill("#userId", "abc");
    await page.click(".form-submit");
    await expect(page.locator(".tag-error")).toHaveText("Invalid User ID. User ID should be number.");
  });

  test("should retry after failure", async ({ page }) => {

    let callCount = 0;
    await page.unroute("**/api/random");

    await page.route("**/api/random", async route => {
      callCount++;
      
      if (callCount === 1) {
        await route.fulfill({
          status: 500,
          contentType: "application/json",
          body: JSON.stringify({
            error: "Server Error"
          })
        });

        return;
      }

      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(mockUser)
      });
    });

    await page.goto("http://localhost:3000");
    await expect(page.locator("#retry")).toBeVisible();
    await page.click("#retry");
    await expect(page.locator("#welcomeUser")).toHaveText("Welcome Leanne Graham");
    await expect(page.locator("#cards")).toContainText("Leanne Graham");
  });

});