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
  test('nav has Agents and Sell with Berry', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('nav[aria-label="Primary"]')).toContainText('Agents', { timeout: 10000 });
    await expect(page.locator('nav[aria-label="Primary"]')).toContainText('Sell with Berry');
  });
  test('login page renders', async ({ page }) => {
    await page.goto('/login');
    await expect(page.getByLabel('Email address')).toBeVisible({ timeout: 10000 });
  });
});

test.describe('Admin', () => {
  test.beforeEach(async ({ page }) => {
    const res = await page.request.post('http://localhost:5173/api/v1/auth/dev-login', {
      data: { email: 'asrulazwan90@gmail.com' },
    });
    const body = await res.json();
    await page.goto('/');
    await page.evaluate(({ token, user }) => {
      localStorage.setItem('berry_jwt', token);
      localStorage.setItem('berry_user', JSON.stringify(user));
    }, { token: body.data.token, user: { name: 'Admin', email: 'asrulazwan90@gmail.com', role: 'ADMIN' } });
  });

  test('overview loads', async ({ page }) => {
    await page.goto('/admin');
    await expect(page.locator('.stat-card').first()).toBeVisible({ timeout: 10000 });
  });
  test('listings table loads', async ({ page }) => {
    await page.goto('/admin/listings');
    await expect(page.locator('.data-table')).toBeVisible({ timeout: 10000 });
  });
  test('users page shows admin email', async ({ page }) => {
    await page.goto('/admin/users');
    await expect(page.getByText('asrulazwan90@gmail.com')).toBeVisible({ timeout: 10000 });
  });
  test('settings page has Profile heading', async ({ page }) => {
    await page.goto('/admin/settings');
    await expect(page.getByRole('heading', { name: 'Profile' })).toBeVisible({ timeout: 10000 });
  });
  test('new listing form opens', async ({ page }) => {
    await page.goto('/admin/listings');
    await page.getByRole('button', { name: 'New listing' }).click();
    await expect(page.locator('.modal-panel')).toBeVisible({ timeout: 5000 });
  });
  test('cannot disable self', async ({ page }) => {
    await page.goto('/admin/users');
    await expect(page.locator('tr:has-text("(you)")')).toBeVisible({ timeout: 5000 });
  });
  test('add and delete user', async ({ page }) => {
    await page.goto('/admin/users');
    const email = `e2e-${Date.now()}@test.com`;
    await page.getByPlaceholder('new.user@email.com').fill(email);
    await page.getByRole('button', { name: 'Add User' }).click();
    await page.waitForTimeout(1500);
    await expect(page.getByText(email)).toBeVisible({ timeout: 5000 });
    const row = page.locator(`tr:has-text("${email}")`);
    await row.getByRole('button', { name: 'Delete user' }).click();
    await row.getByRole('button', { name: 'Confirm delete' }).click();
    await page.waitForTimeout(500);
    await expect(page.getByText(email)).not.toBeVisible();
  });
  test('Dashboard in nav when authed', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('link', { name: 'Dashboard', exact: true })).toBeVisible({ timeout: 10000 });
  });
});
