import { test, expect } from '@playwright/test';

test.describe('Public', () => {
  test('homepage loads', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h1')).toContainText('Find a home');
  });

  test('listings page has properties', async ({ page }) => {
    await page.goto('/listings');
    await expect(page.locator('.property-card').first()).toBeVisible({ timeout: 10000 });
  });

  test('property detail page works', async ({ page }) => {
    await page.goto('/listings');
    await page.locator('.property-card__link').first().click();
    await expect(page.locator('h1').first()).toBeVisible({ timeout: 10000 });
  });

  test('nav has correct links', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('nav[aria-label="Primary"]')).toContainText('Agents', { timeout: 10000 });
    await expect(page.locator('header .nav__signin')).toBeVisible({ timeout: 10000 });
  });

  test('login page renders', async ({ page }) => {
    await page.goto('/login');
    await expect(page.locator('input[type="email"]')).toBeVisible();
  });
});

test.describe('Admin', () => {
  test('overview loads', async ({ page }) => {
    await page.goto('/admin');
    await expect(page.locator('.stat-card').first()).toBeVisible({ timeout: 10000 });
  });

  test('listings table loads', async ({ page }) => {
    await page.goto('/admin/listings');
    await expect(page.locator('.data-table')).toBeVisible({ timeout: 10000 });
  });

  test('users page loads', async ({ page }) => {
    await page.goto('/admin/users');
    await expect(page.locator('td')).toContainText('asrulazwan90@gmail.com', { timeout: 10000 });
  });

  test('settings page loads', async ({ page }) => {
    await page.goto('/admin/settings');
    await expect(page.locator('h2')).toContainText('Profile');
  });

  test('new listing form opens', async ({ page }) => {
    await page.goto('/admin/listings');
    await page.locator('button:has-text("New listing")').click();
    await expect(page.locator('.modal-panel')).toBeVisible({ timeout: 5000 });
  });

  test('cannot disable self', async ({ page }) => {
    await page.goto('/admin/users');
    await expect(page.locator('tr:has-text("(you)")')).toBeVisible({ timeout: 5000 });
  });

  test('add and delete user', async ({ page }) => {
    await page.goto('/admin/users');
    const email = `e2e-${Date.now()}@test.com`;
    await page.locator('input[type="email"]').fill(email);
    await page.locator('button:has-text("Add User")').click();
    await page.waitForTimeout(1500);
    await expect(page.locator('td')).toContainText(email);
    const row = page.locator(`tr:has-text("${email}")`);
    await row.locator('button[aria-label="Delete user"]').click();
    await row.locator('button[aria-label="Confirm delete"]').click();
    await page.waitForTimeout(500);
    await expect(page.locator('td')).not.toContainText(email);
  });

  test('nav shows Dashboard when authed', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('header')).toContainText('Dashboard', { timeout: 10000 });
  });
});
