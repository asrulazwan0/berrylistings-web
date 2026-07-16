# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: admin.spec.ts >> User Management >> add and delete user
- Location: tests/admin.spec.ts:54:3

# Error details

```
TimeoutError: page.waitForSelector: Timeout 10000ms exceeded.
Call log:
  - waiting for locator('nav[aria-label="Admin"]') to be visible

```

# Page snapshot

```yaml
- generic [ref=e2]:
  - link "Skip to content" [ref=e3] [cursor=pointer]:
    - /url: "#main"
  - banner [ref=e4]:
    - generic [ref=e5]:
      - link "Berry Listings" [ref=e6] [cursor=pointer]:
        - /url: /
        - img [ref=e7]
        - text: Berry Listings
      - navigation "Primary" [ref=e11]:
        - link "Sell with Berry" [ref=e12] [cursor=pointer]:
          - /url: "#"
        - link "Agents" [ref=e13] [cursor=pointer]:
          - /url: "#"
      - generic [ref=e14]:
        - link "Sign in" [ref=e15] [cursor=pointer]:
          - /url: /login
        - link "List a property" [ref=e16] [cursor=pointer]:
          - /url: /login
  - main [ref=e17]:
    - generic [ref=e18]:
      - generic [ref=e19]: For agents & admins
      - heading "Manage your listings in one calm place." [level=2] [ref=e20]
      - paragraph [ref=e21]: Publish new properties, update pricing, and respond to buyer inquiries — all from the Berry agent dashboard.
    - generic [ref=e23]:
      - generic [ref=e24]: Development Login
      - heading "Sign in to Berry Listings" [level=1] [ref=e25]
      - paragraph [ref=e26]: Dev mode — enter your registered email to sign in.
      - paragraph [ref=e27]: Too many login attempts, please try again later.
      - generic [ref=e28]:
        - text: Email address
        - textbox "Email address" [ref=e29]:
          - /placeholder: asrulazwan90@gmail.com
          - text: asrulazwan90@gmail.com
        - button "Sign in as Admin" [ref=e30] [cursor=pointer]
      - paragraph [ref=e31]: "Also try: demo@berrylistings.local (regular user)"
  - contentinfo [ref=e32]:
    - generic [ref=e33]:
      - generic [ref=e34]:
        - generic [ref=e35]:
          - link "Berry Listings" [ref=e36] [cursor=pointer]:
            - /url: /
            - img [ref=e37]
            - text: Berry Listings
          - paragraph [ref=e41]: A warmer way to browse, buy, and sell property — built for agents who answer their phone.
        - generic [ref=e42]:
          - heading "Explore" [level=4] [ref=e43]
          - list [ref=e44]:
            - listitem [ref=e45]:
              - link "Buy" [ref=e46] [cursor=pointer]:
                - /url: /listings
            - listitem [ref=e47]:
              - link "Rent" [ref=e48] [cursor=pointer]:
                - /url: /listings
            - listitem [ref=e49]:
              - link "Sell with Berry" [ref=e50] [cursor=pointer]:
                - /url: "#"
            - listitem [ref=e51]:
              - link "New developments" [ref=e52] [cursor=pointer]:
                - /url: "#"
        - generic [ref=e53]:
          - heading "Company" [level=4] [ref=e54]
          - list [ref=e55]:
            - listitem [ref=e56]:
              - link "About" [ref=e57] [cursor=pointer]:
                - /url: "#"
            - listitem [ref=e58]:
              - link "Agents" [ref=e59] [cursor=pointer]:
                - /url: "#"
            - listitem [ref=e60]:
              - link "Careers" [ref=e61] [cursor=pointer]:
                - /url: "#"
            - listitem [ref=e62]:
              - link "Contact" [ref=e63] [cursor=pointer]:
                - /url: "#"
        - generic [ref=e64]:
          - heading "Account" [level=4] [ref=e65]
          - list [ref=e66]:
            - listitem [ref=e67]:
              - link "Sign in" [ref=e68] [cursor=pointer]:
                - /url: /login
            - listitem [ref=e69]:
              - link "Agent dashboard" [ref=e70] [cursor=pointer]:
                - /url: /admin
            - listitem [ref=e71]:
              - link "Help center" [ref=e72] [cursor=pointer]:
                - /url: "#"
      - generic [ref=e73]:
        - generic [ref=e74]: © 2026 Berry Listings. All rights reserved.
        - generic [ref=e75]: Made for people, not portals.
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | async function loginAsAdmin(page) {
  4  |   await page.goto('/login');
  5  |   await page.locator('input[type="email"]').fill('asrulazwan90@gmail.com');
  6  |   await page.locator('button:has-text("Sign in as Admin")').click();
> 7  |   await page.waitForSelector('nav[aria-label="Admin"]', { timeout: 10000 });
     |              ^ TimeoutError: page.waitForSelector: Timeout 10000ms exceeded.
  8  | }
  9  | 
  10 | test.describe('Admin CRUD', () => {
  11 |   test.beforeEach(async ({ page }) => { await loginAsAdmin(page); });
  12 | 
  13 |   test('create new property form opens', async ({ page }) => {
  14 |     await page.goto('/admin/listings');
  15 |     await page.locator('button:has-text("New listing")').click();
  16 |     await expect(page.locator('.modal-panel')).toBeVisible({ timeout: 5000 });
  17 |     await expect(page.locator('.modal-panel input').first()).toBeVisible();
  18 |     await page.locator('button:has-text("Cancel")').click();
  19 |     await expect(page.locator('.modal-panel')).not.toBeVisible();
  20 |   });
  21 | 
  22 |   test('delete requires confirmation', async ({ page }) => {
  23 |     await page.goto('/admin/listings');
  24 |     const deleteBtn = page.locator('button[aria-label="Delete listing"]').first();
  25 |     await deleteBtn.click();
  26 |     await expect(page.locator('button[aria-label="Confirm delete"]').first()).toBeVisible({ timeout: 3000 });
  27 |   });
  28 | 
  29 |   test('status filter works', async ({ page }) => {
  30 |     await page.goto('/admin/listings');
  31 |     await page.locator('button.chip:has-text("Active")').click();
  32 |     await page.waitForTimeout(500);
  33 |     const badges = page.locator('.badge--success');
  34 |     expect(await badges.count()).toBeGreaterThan(0);
  35 |   });
  36 | 
  37 |   test('sign out works', async ({ page }) => {
  38 |     await page.locator('button:has-text("Sign out")').click();
  39 |     await page.waitForTimeout(1000);
  40 |     await page.goto('/');
  41 |     await expect(page.locator('header .nav__signin')).toBeVisible({ timeout: 5000 });
  42 |   });
  43 | });
  44 | 
  45 | test.describe('User Management', () => {
  46 |   test.beforeEach(async ({ page }) => { await loginAsAdmin(page); });
  47 | 
  48 |   test('users page lists users', async ({ page }) => {
  49 |     await page.goto('/admin/users');
  50 |     await expect(page.locator('.data-table')).toBeVisible({ timeout: 5000 });
  51 |     await expect(page.locator('td')).toContainText('asrulazwan90@gmail.com');
  52 |   });
  53 | 
  54 |   test('add and delete user', async ({ page }) => {
  55 |     await page.goto('/admin/users');
  56 |     const email = `test-${Date.now()}@example.com`;
  57 |     await page.locator('input[type="email"]').fill(email);
  58 |     await page.locator('button:has-text("Add User")').click();
  59 |     await page.waitForTimeout(1000);
  60 |     await expect(page.locator('td')).toContainText(email);
  61 |     // Delete
  62 |     const userRow = page.locator(`tr:has-text("${email}")`);
  63 |     await userRow.locator('button[aria-label="Delete user"]').click();
  64 |     await expect(userRow.locator('button[aria-label="Confirm delete"]')).toBeVisible({ timeout: 3000 });
  65 |     await userRow.locator('button[aria-label="Confirm delete"]').click();
  66 |     await page.waitForTimeout(500);
  67 |     await expect(page.locator('td')).not.toContainText(email);
  68 |   });
  69 | });
  70 | 
```