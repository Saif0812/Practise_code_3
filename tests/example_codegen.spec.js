import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('https://playwright.dev/');
  await expect(page.locator('h1')).toContainText('Playwright');
  await expect(page.getByRole('heading', { name: 'Playwright enables reliable' }).locator('span')).toBeVisible();
  await page.getByRole('link', { name: 'Get started' }).click();
  await expect(page.getByRole('heading', { name: 'Installation' })).toBeVisible();
});