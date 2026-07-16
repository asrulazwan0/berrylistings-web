# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: public.spec.ts >> Public >> login page renders
- Location: tests/public.spec.ts:26:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('input[type="email"]')
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('input[type="email"]')

```

```yaml
- link "Skip to content":
  - /url: "#main"
- banner:
  - link "Berry Listings":
    - /url: /
  - navigation "Primary":
    - link "Sell with Berry":
      - /url: "#"
    - link "Agents":
      - /url: "#"
  - link "Dashboard":
    - /url: /admin
- contentinfo:
  - link "Berry Listings":
    - /url: /
  - paragraph: A warmer way to browse, buy, and sell property — built for agents who answer their phone.
  - heading "Explore" [level=4]
  - list:
    - listitem:
      - link "Buy":
        - /url: /listings
    - listitem:
      - link "Rent":
        - /url: /listings
    - listitem:
      - link "Sell with Berry":
        - /url: "#"
    - listitem:
      - link "New developments":
        - /url: "#"
  - heading "Company" [level=4]
  - list:
    - listitem:
      - link "About":
        - /url: "#"
    - listitem:
      - link "Agents":
        - /url: "#"
    - listitem:
      - link "Careers":
        - /url: "#"
    - listitem:
      - link "Contact":
        - /url: "#"
  - heading "Account" [level=4]
  - list:
    - listitem:
      - link "Sign in":
        - /url: /login
    - listitem:
      - link "Agent dashboard":
        - /url: /admin
    - listitem:
      - link "Help center":
        - /url: "#"
  - text: © 2026 Berry Listings. All rights reserved. Made for people, not portals.
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test.describe('Public', () => {
  4  |   test('homepage loads', async ({ page }) => {
  5  |     await page.goto('/');
  6  |     await expect(page.locator('h1')).toContainText('Find a home');
  7  |   });
  8  | 
  9  |   test('listings page has properties', async ({ page }) => {
  10 |     await page.goto('/listings');
  11 |     await expect(page.locator('.property-card').first()).toBeVisible({ timeout: 10000 });
  12 |   });
  13 | 
  14 |   test('property detail page works', async ({ page }) => {
  15 |     await page.goto('/listings');
  16 |     await page.locator('.property-card__link').first().click();
  17 |     await expect(page.locator('h1').first()).toBeVisible({ timeout: 10000 });
  18 |   });
  19 | 
  20 |   test('nav has correct links', async ({ page }) => {
  21 |     await page.goto('/');
  22 |     await expect(page.locator('nav[aria-label="Primary"]')).toContainText('Agents');
  23 |     await expect(page.locator('header .nav__signin')).toBeVisible();
  24 |   });
  25 | 
  26 |   test('login page renders', async ({ page }) => {
  27 |     await page.goto('/login');
> 28 |     await expect(page.locator('input[type="email"]')).toBeVisible();
     |                                                       ^ Error: expect(locator).toBeVisible() failed
  29 |   });
  30 | });
  31 | 
  32 | test.describe('Admin', () => {
  33 |   test('overview loads', async ({ page }) => {
  34 |     await page.goto('/admin');
  35 |     await expect(page.locator('.stat-card').first()).toBeVisible({ timeout: 10000 });
  36 |   });
  37 | 
  38 |   test('listings table loads', async ({ page }) => {
  39 |     await page.goto('/admin/listings');
  40 |     await expect(page.locator('.data-table')).toBeVisible({ timeout: 10000 });
  41 |   });
  42 | 
  43 |   test('users page loads', async ({ page }) => {
  44 |     await page.goto('/admin/users');
  45 |     await expect(page.locator('td')).toContainText('asrulazwan90@gmail.com', { timeout: 10000 });
  46 |   });
  47 | 
  48 |   test('settings page loads', async ({ page }) => {
  49 |     await page.goto('/admin/settings');
  50 |     await expect(page.locator('h2')).toContainText('Profile');
  51 |   });
  52 | 
  53 |   test('new listing form opens', async ({ page }) => {
  54 |     await page.goto('/admin/listings');
  55 |     await page.locator('button:has-text("New listing")').click();
  56 |     await expect(page.locator('.modal-panel')).toBeVisible({ timeout: 5000 });
  57 |   });
  58 | 
  59 |   test('cannot disable self', async ({ page }) => {
  60 |     await page.goto('/admin/users');
  61 |     await expect(page.locator('tr:has-text("(you)")')).toBeVisible({ timeout: 5000 });
  62 |   });
  63 | 
  64 |   test('add and delete user', async ({ page }) => {
  65 |     await page.goto('/admin/users');
  66 |     const email = `e2e-${Date.now()}@test.com`;
  67 |     await page.locator('input[type="email"]').fill(email);
  68 |     await page.locator('button:has-text("Add User")').click();
  69 |     await page.waitForTimeout(1500);
  70 |     await expect(page.locator('td')).toContainText(email);
  71 |     const row = page.locator(`tr:has-text("${email}")`);
  72 |     await row.locator('button[aria-label="Delete user"]').click();
  73 |     await row.locator('button[aria-label="Confirm delete"]').click();
  74 |     await page.waitForTimeout(500);
  75 |     await expect(page.locator('td')).not.toContainText(email);
  76 |   });
  77 | 
  78 |   test('nav shows Dashboard when authed', async ({ page }) => {
  79 |     await page.goto('/');
  80 |     await expect(page.locator('header')).toContainText('Dashboard');
  81 |   });
  82 | });
  83 | 
```