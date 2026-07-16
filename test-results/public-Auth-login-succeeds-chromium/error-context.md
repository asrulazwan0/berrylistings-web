# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: public.spec.ts >> Auth >> login succeeds
- Location: tests/public.spec.ts:42:3

# Error details

```
TimeoutError: page.waitForSelector: Timeout 10000ms exceeded.
Call log:
  - waiting for locator('.admin-shell, .stat-card, nav[aria-label="Admin"]') to be visible

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
> 7  |   await page.waitForSelector('.admin-shell, .stat-card, nav[aria-label="Admin"]', { timeout: 10000 });
     |              ^ TimeoutError: page.waitForSelector: Timeout 10000ms exceeded.
  8  | }
  9  | 
  10 | test.describe('Public Site', () => {
  11 |   test('homepage loads', async ({ page }) => {
  12 |     await page.goto('/');
  13 |     await expect(page.locator('h1')).toContainText('Find a home');
  14 |     await expect(page.locator('.property-card').first()).toBeVisible({ timeout: 10000 });
  15 |   });
  16 | 
  17 |   test('listings page shows properties', async ({ page }) => {
  18 |     await page.goto('/listings');
  19 |     await expect(page.locator('.property-card').first()).toBeVisible({ timeout: 10000 });
  20 |   });
  21 | 
  22 |   test('property detail page loads', async ({ page }) => {
  23 |     await page.goto('/listings');
  24 |     await page.locator('.property-card__link').first().click();
  25 |     await expect(page.locator('h1').first()).toBeVisible({ timeout: 10000 });
  26 |   });
  27 | 
  28 |   test('nav has correct public links', async ({ page }) => {
  29 |     await page.goto('/');
  30 |     await expect(page.locator('nav[aria-label="Primary"]')).toContainText('Sell with Berry');
  31 |     await expect(page.locator('nav[aria-label="Primary"]')).toContainText('Agents');
  32 |     await expect(page.locator('header .nav__signin')).toBeVisible();
  33 |   });
  34 | 
  35 |   test('footer exists', async ({ page }) => {
  36 |     await page.goto('/');
  37 |     await expect(page.locator('footer, [class*="footer"]').first()).toBeVisible({ timeout: 5000 });
  38 |   });
  39 | });
  40 | 
  41 | test.describe('Auth', () => {
  42 |   test('login succeeds', async ({ page }) => {
  43 |     await loginAsAdmin(page);
  44 |     await expect(page.locator('nav[aria-label="Admin"]')).toBeVisible();
  45 |   });
  46 | 
  47 |   test('nav hides sign-in when authenticated', async ({ page }) => {
  48 |     await loginAsAdmin(page);
  49 |     await expect(page.locator('header .nav__signin')).not.toBeVisible();
  50 |   });
  51 | });
  52 | 
  53 | test.describe('Admin', () => {
  54 |   test.beforeEach(async ({ page }) => { await loginAsAdmin(page); });
  55 | 
  56 |   test('overview shows stats', async ({ page }) => {
  57 |     await page.goto('/admin');
  58 |     await expect(page.locator('.stat-card').first()).toBeVisible({ timeout: 5000 });
  59 |   });
  60 | 
  61 |   test('listings shows table', async ({ page }) => {
  62 |     await page.goto('/admin/listings');
  63 |     await expect(page.locator('.data-table')).toBeVisible({ timeout: 5000 });
  64 |   });
  65 | 
  66 |   test('users page loads', async ({ page }) => {
  67 |     await page.goto('/admin/users');
  68 |     await expect(page.locator('h1')).toContainText('Users');
  69 |   });
  70 | 
  71 |   test('settings page loads', async ({ page }) => {
  72 |     await page.goto('/admin/settings');
  73 |     await expect(page.locator('h2')).toContainText('Profile');
  74 |   });
  75 | 
  76 |   test('sidebar navigates', async ({ page }) => {
  77 |     await page.locator('nav[aria-label="Admin"] >> text=Users').click();
  78 |     await page.waitForURL('**/admin/users', { timeout: 5000 });
  79 |     await expect(page.locator('h1')).toContainText('Users');
  80 |   });
  81 | 
  82 |   test('cannot disable self on users page', async ({ page }) => {
  83 |     await page.goto('/admin/users');
  84 |     const myRow = page.locator('tr:has-text("(you)")');
  85 |     await expect(myRow).toBeVisible({ timeout: 5000 });
  86 |     await expect(myRow.locator('button.chip')).not.toBeVisible();
  87 |   });
  88 | });
  89 | 
```