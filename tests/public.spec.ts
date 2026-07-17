import { test, expect } from '@playwright/test';

async function devLogin(page: any, email = 'asrulazwan90@gmail.com') {
  const res = await page.request.post('http://localhost:5173/api/v1/auth/dev-login', { data: { email } });
  const { data } = await res.json();
  await page.goto('/');
  await page.evaluate(({ t, u }: any) => {
    localStorage.setItem('berry_jwt', t);
    localStorage.setItem('berry_user', JSON.stringify(u));
  }, { t: data.token, u: { ...data.user, name: email.split('@')[0] } });
}

test.describe('Public site', () => {
  test('homepage loads', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h1')).toContainText('Find a home');
  });
  test('listings page shows cards', async ({ page }) => {
    await page.goto('/listings');
    await expect(page.locator('.property-card').first()).toBeVisible({ timeout: 10000 });
  });
  test('property detail opens', async ({ page }) => {
    await page.goto('/listings');
    await page.locator('.property-card__link').first().click();
    await expect(page.locator('h1').first()).toBeVisible({ timeout: 10000 });
  });
  test('login page has form', async ({ page }) => {
    await page.goto('/login');
    await expect(page.getByLabel('Email address')).toBeVisible();
    await expect(page.getByText('Sign in as Admin')).toBeVisible();
  });
  test('nav hides Buy/Rent, shows Sign in', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('nav[aria-label="Primary"] >> text=Buy')).not.toBeVisible();
    await expect(page.getByText('Sign in')).toBeVisible();
  });
});

test.describe('Auth', () => {
  test('admin login redirects to overview', async ({ page }) => {
    await devLogin(page);
    await page.goto('/');
    await expect(page.getByRole('link', { name: 'Dashboard' })).toBeVisible();
  });
  test('nav shows Dashboard when logged in', async ({ page }) => {
    await devLogin(page);
    await page.goto('/');
    await expect(page.getByText('Sign in')).not.toBeVisible();
    await expect(page.getByRole('link', { name: 'Dashboard' })).toBeVisible();
  });
  test('regular user sees overview with welcome', async ({ page }) => {
    await devLogin(page, 'demo@berrylistings.local');
    await page.goto('/admin');
    await expect(page.getByRole('heading', { name: /Welcome/ })).toBeVisible();
  });
});

test.describe('Admin Overview', () => {
  test.beforeEach(async ({ page }) => { await devLogin(page); });
  test('shows stat cards', async ({ page }) => {
    await page.goto('/admin');
    await expect(page.locator('.stat-card').first()).toBeVisible({ timeout: 10000 });
  });
  test('shows recent listings', async ({ page }) => {
    await page.goto('/admin');
    await expect(page.getByText('Recent listings')).toBeVisible();
    await expect(page.locator('.data-table')).toBeVisible();
  });
  test('has quick link cards', async ({ page }) => {
    await page.goto('/admin');
    await expect(page.getByText('Manage people')).toBeVisible();
    await expect(page.getByText('Manage properties')).toBeVisible();
  });
  test('sidebar navigates', async ({ page }) => {
    await page.goto('/admin');
    const nav = page.locator('nav[aria-label="Admin"]');
    await expect(nav.getByText('Overview')).toBeVisible();
    await expect(nav.getByText('Listings')).toBeVisible();
    await expect(nav.getByText('Users')).toBeVisible();
    await expect(nav.getByText('Settings')).toBeVisible();
    await expect(nav.getByText('Roles')).toBeVisible();
  });
});

test.describe('Admin Listings', () => {
  test.beforeEach(async ({ page }) => { await devLogin(page); });
  test('page title', async ({ page }) => {
    await page.goto('/admin/listings');
    await expect(page.getByRole('heading', { name: 'Listings' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'New listing' })).toBeVisible();
  });
  test('property table loads', async ({ page }) => {
    await page.goto('/admin/listings');
    await expect(page.locator('.data-table')).toBeVisible({ timeout: 10000 });
  });
  test('search works', async ({ page }) => {
    await page.goto('/admin/listings');
    await page.locator('#admin-search').fill('Sunset');
    await page.waitForTimeout(500);
    await expect(page.getByRole('cell', { name: /Sunset/ })).toBeVisible();
  });
  test('status chips filter', async ({ page }) => {
    await page.goto('/admin/listings');
    await page.locator('.chip').filter({ hasText: 'Active' }).click();
    await page.waitForTimeout(500);
    expect(await page.locator('.badge--success').count()).toBeGreaterThan(0);
  });
  test('new listing modal', async ({ page }) => {
    await page.goto('/admin/listings');
    await page.getByRole('button', { name: 'New listing' }).click();
    await expect(page.locator('.modal-panel')).toBeVisible();
    await page.locator('button:has-text("Cancel")').click();
    await expect(page.locator('.modal-panel')).not.toBeVisible();
  });
  test('delete confirmation modal', async ({ page }) => {
    await page.goto('/admin/listings');
    await page.locator('button[aria-label="Delete listing"]').first().click();
    await expect(page.locator('.modal-panel')).toBeVisible();
    await expect(page.getByText('Delete permanently')).toBeVisible();
    await page.locator('button:has-text("Cancel")').click();
  });
  test('pagination visible', async ({ page }) => {
    await page.goto('/admin/listings');
    await expect(page.getByText(/Showing.*of.*listings/)).toBeVisible();
  });
});

test.describe('Admin Users', () => {
  test.beforeEach(async ({ page }) => { await devLogin(page); });
  test('page title', async ({ page }) => {
    await page.goto('/admin/users');
    await expect(page.getByRole('heading', { name: 'Users' })).toBeVisible();
  });
  test('has user data', async ({ page }) => {
    await page.goto('/admin/users');
    await expect(page.locator('.data-table')).toBeVisible();
  });
  test('search filters', async ({ page }) => {
    await page.goto('/admin/users');
    await page.locator('input[placeholder*="Search"]').fill('demo');
    await page.waitForTimeout(500);
    await expect(page.getByRole('cell', { name: /demo@berrylistings/ })).toBeVisible();
  });
  test('add user modal', async ({ page }) => {
    await page.goto('/admin/users');
    await page.getByRole('button', { name: '+ Add user' }).click();
    await expect(page.locator('.modal-panel')).toBeVisible();
    await expect(page.getByLabel('Email address')).toBeVisible();
    await page.locator('button:has-text("Cancel")').click();
  });
  test('add and delete user', async ({ page }) => {
    await page.goto('/admin/users');
    const email = `pw-${Date.now()}@test.com`;
    await page.getByRole('button', { name: '+ Add user' }).click();
    await page.getByLabel('Email address').fill(email);
    await page.getByRole('button', { name: 'Create' }).click();
    await page.waitForTimeout(1000);
    await expect(page.getByRole('cell', { name: email })).toBeVisible();
    const row = page.locator('tr').filter({ hasText: email });
    await row.getByLabel('Delete user').click();
    await page.getByRole('button', { name: 'Delete permanently' }).click();
    await page.waitForTimeout(500);
    await expect(page.getByRole('cell', { name: email })).not.toBeVisible();
  });
  test('toggle user confirmation', async ({ page }) => {
    await page.goto('/admin/users');
    const row = page.locator('tr').filter({ hasText: 'demo@berrylistings.local' });
    await row.getByLabel(/Disable|Enable/).click();
    await expect(page.getByText('Are you sure')).toBeVisible();
    await page.locator('button:has-text("Cancel")').click();
  });
  test('cannot modify self', async ({ page }) => {
    await page.goto('/admin/users');
    const myRow = page.locator('tr').filter({ hasText: '(you)' });
    await myRow.getByLabel('Edit user').click();
    await expect(page.locator('select[disabled]')).toBeVisible();
    await expect(page.getByText('You cannot change your own role')).toBeVisible();
  });
  test('delete modal readable', async ({ page }) => {
    await page.goto('/admin/users');
    const row = page.locator('tr').filter({ hasText: 'demo@berrylistings.local' });
    await row.getByLabel('Delete user').click();
    const warning = page.locator('.modal-panel');
    await expect(warning.getByText(/permanently delete/)).toBeVisible();
  });
  test('pagination visible', async ({ page }) => {
    await page.goto('/admin/users');
    await expect(page.getByText(/Showing.*of.*users/)).toBeVisible();
  });
});

test.describe('Admin Roles', () => {
  test.beforeEach(async ({ page }) => { await devLogin(page); });
  test('page loads', async ({ page }) => {
    await page.goto('/admin/roles');
    await expect(page.getByRole('heading', { name: 'Roles' })).toBeVisible();
  });
  test('built-in roles marked', async ({ page }) => {
    await page.goto('/admin/roles');
    await expect(page.getByText('built-in')).toHaveCount(2);
  });
  test('create and delete role', async ({ page }) => {
    await page.goto('/admin/roles');
    await page.getByRole('button', { name: '+ New role' }).click();
    await page.getByLabel('Role name').fill('TESTER2');
    await page.getByRole('button', { name: 'Create' }).click();
    await page.waitForTimeout(500);
    await expect(page.locator('.card').filter({ hasText: 'TESTER2' })).toBeVisible();
    // Cleanup
    const card = page.locator('.card').filter({ hasText: 'TESTER2' });
    await card.getByLabel('Delete role').click();
    await page.waitForTimeout(300);
    await expect(page.locator('.card').filter({ hasText: 'TESTER2' })).not.toBeVisible();
  });
  test('edit role shows checkboxes', async ({ page }) => {
    await page.goto('/admin/roles');
    await page.locator('.card').filter({ hasText: 'USER' }).getByLabel('Edit role').first().click();
    await expect(page.locator('input[type="checkbox"]').first()).toBeVisible();
    await page.locator('button:has-text("Cancel")').click();
  });
  test('cannot delete built-in roles', async ({ page }) => {
    await page.goto('/admin/roles');
    await expect(page.locator('.card').filter({ hasText: 'ADMIN' }).getByLabel('Delete role')).not.toBeVisible();
  });
});

test.describe('Admin Settings', () => {
  test.beforeEach(async ({ page }) => { await devLogin(page); });
  test('page loads', async ({ page }) => {
    await page.goto('/admin/settings');
    await expect(page.getByRole('heading', { name: 'Settings' })).toBeVisible();
  });
  test('shows profile info', async ({ page }) => {
    await page.goto('/admin/settings');
    await expect(page.getByText('Profile')).toBeVisible();
    await expect(page.getByText('asrulazwan90@gmail.com')).toBeVisible();
  });
  test('checkboxes interactive', async ({ page }) => {
    await page.goto('/admin/settings');
    await expect(page.locator('input[type="checkbox"]').first()).toBeVisible();
  });
});

test.describe('Access control', () => {
  test('regular user gets Access Denied on /admin/users', async ({ page }) => {
    await devLogin(page, 'demo@berrylistings.local');
    await page.goto('/admin/users');
    await expect(page.getByText('Access denied')).toBeVisible({ timeout: 5000 });
    await expect(page.getByText('Sign out')).toBeVisible();
  });
  test('admin can access everything', async ({ page }) => {
    await devLogin(page);
    for (const path of ['/admin', '/admin/listings', '/admin/users', '/admin/settings', '/admin/roles']) {
      await page.goto(path);
      await expect(page.getByRole('heading').first()).toBeVisible({ timeout: 5000 });
    }
  });
  test('user without properties:view sees welcome card', async ({ page }) => {
    await devLogin(page, 'demo@berrylistings.local');
    await page.goto('/admin');
    await expect(page.getByText(/Welcome.*Berry/)).toBeVisible({ timeout: 5000 });
    await expect(page.getByText('Recent listings')).not.toBeVisible();
  });
});
