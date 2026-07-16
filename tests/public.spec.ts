import { test, expect } from '@playwright/test';

async function loginAsAdmin(page) {
  // Use API directly to get token, then set localStorage
  const res = await page.request.post('http://localhost:3000/api/v1/auth/dev-login', {
    data: { email: 'asrulazwan90@gmail.com' },
  });
  const { data } = await res.json();
  await page.goto('/');
  await page.evaluate(({ token, user }) => {
    localStorage.setItem('berry_jwt', token);
    localStorage.setItem('berry_user', JSON.stringify(user));
  }, { token: data.token, user: { name: 'Admin', email: 'asrulazwan90@gmail.com', role: 'ADMIN' } });
}

test.describe('Public Site', () => {
  test('homepage loads', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h1')).toContainText('Find a home');
    await expect(page.locator('.property-card').first()).toBeVisible({ timeout: 10000 });
  });

  test('listings page shows properties', async ({ page }) => {
    await page.goto('/listings');
    await expect(page.locator('.property-card').first()).toBeVisible({ timeout: 10000 });
  });

  test('property detail page loads', async ({ page }) => {
    await page.goto('/listings');
    await page.locator('.property-card__link').first().click();
    await expect(page.locator('h1').first()).toBeVisible({ timeout: 10000 });
  });

  test('nav has correct public links', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('nav[aria-label="Primary"]')).toContainText('Sell with Berry');
    await expect(page.locator('nav[aria-label="Primary"]')).toContainText('Agents');
    await expect(page.locator('header .nav__signin')).toBeVisible();
  });

  test('footer exists', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('footer, [class*="footer"]').first()).toBeVisible({ timeout: 5000 });
  });
});

test.describe('Auth', () => {
  test('login page renders', async ({ page }) => {
    await page.goto('/login');
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('button:has-text("Sign in as Admin")')).toBeVisible();
  });

  test('nav hides sign-in when authenticated', async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto('/');
    await expect(page.locator('header .nav__signin')).not.toBeVisible();
    await expect(page.locator('header')).toContainText('Dashboard');
  });
});

test.describe('Admin', () => {
  test.beforeEach(async ({ page }) => { await loginAsAdmin(page); });

  test('overview shows stats', async ({ page }) => {
    await page.goto('/admin');
    await expect(page.locator('.stat-card').first()).toBeVisible({ timeout: 5000 });
  });

  test('listings shows table', async ({ page }) => {
    await page.goto('/admin/listings');
    await expect(page.locator('.data-table')).toBeVisible({ timeout: 5000 });
  });

  test('users page loads', async ({ page }) => {
    await page.goto('/admin/users');
    await expect(page.locator('h1')).toContainText('Users');
  });

  test('settings page loads', async ({ page }) => {
    await page.goto('/admin/settings');
    await expect(page.locator('h2')).toContainText('Profile');
  });

  test('cannot disable self', async ({ page }) => {
    await page.goto('/admin/users');
    const myRow = page.locator('tr:has-text("(you)")');
    await expect(myRow).toBeVisible({ timeout: 5000 });
    await expect(myRow.locator('button.chip')).not.toBeVisible();
  });
});

test.describe('Admin CRUD', () => {
  test.beforeEach(async ({ page }) => { await loginAsAdmin(page); });

  test('new listing form opens and closes', async ({ page }) => {
    await page.goto('/admin/listings');
    await page.locator('button:has-text("New listing")').click();
    await expect(page.locator('.modal-panel')).toBeVisible({ timeout: 5000 });
    await page.locator('button:has-text("Cancel")').click();
    await expect(page.locator('.modal-panel')).not.toBeVisible();
  });

  test('delete confirmation shows', async ({ page }) => {
    await page.goto('/admin/listings');
    await page.locator('button[aria-label="Delete listing"]').first().click();
    await expect(page.locator('button[aria-label="Confirm delete"]').first()).toBeVisible({ timeout: 3000 });
  });

  test('add and delete user', async ({ page }) => {
    await page.goto('/admin/users');
    const email = `test-${Date.now()}@example.com`;
    await page.locator('input[type="email"]').fill(email);
    await page.locator('button:has-text("Add User")').click();
    await page.waitForTimeout(1000);
    await expect(page.locator('td')).toContainText(email);
    const userRow = page.locator(`tr:has-text("${email}")`);
    await userRow.locator('button[aria-label="Delete user"]').click();
    await expect(userRow.locator('button[aria-label="Confirm delete"]')).toBeVisible({ timeout: 3000 });
    await userRow.locator('button[aria-label="Confirm delete"]').click();
    await page.waitForTimeout(500);
    await expect(page.locator('td')).not.toContainText(email);
  });
});
