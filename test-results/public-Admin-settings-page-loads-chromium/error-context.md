# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: public.spec.ts >> Admin >> settings page loads
- Location: tests/public.spec.ts:48:3

# Error details

```
Error: expect(locator).toContainText(expected) failed

Locator: locator('h2')
Expected substring: "Profile"
Error: strict mode violation: locator('h2') resolved to 2 elements:
    1) <h2>Profile</h2> aka getByRole('heading', { name: 'Profile' })
    2) <h2>General</h2> aka getByRole('heading', { name: 'General' })

Call log:
  - Expect "toContainText" with timeout 5000ms
  - waiting for locator('h2')

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
      - link "Dashboard" [ref=e15] [cursor=pointer]:
        - /url: /admin
  - generic [ref=e16]:
    - complementary "Admin navigation" [ref=e17]:
      - link "Berry Admin" [ref=e18] [cursor=pointer]:
        - /url: /
        - img [ref=e19]
        - text: Berry Admin
      - navigation "Admin" [ref=e23]:
        - link "Overview" [ref=e24] [cursor=pointer]:
          - /url: /admin
        - link "Listings" [ref=e25] [cursor=pointer]:
          - /url: /admin/listings
        - link "Users" [ref=e26] [cursor=pointer]:
          - /url: /admin/users
        - link "Settings" [ref=e27] [cursor=pointer]:
          - /url: /admin/settings
      - generic [ref=e28]:
        - generic [ref=e29]:
          - generic [ref=e30]: A
          - generic [ref=e31]:
            - generic [ref=e32]: Admin
            - generic [ref=e33]: Admin
        - button "Sign out" [ref=e34] [cursor=pointer]
    - generic [ref=e35]:
      - banner [ref=e36]:
        - generic [ref=e38]:
          - generic [ref=e39]: Berry Admin
          - heading "Dashboard" [level=1] [ref=e40]
        - link "View site" [ref=e42] [cursor=pointer]:
          - /url: /
      - main [ref=e43]:
        - generic [ref=e44]:
          - heading "Profile" [level=2] [ref=e45]
          - paragraph [ref=e46]: Your account information.
          - generic [ref=e47]:
            - generic [ref=e48]: Name
            - textbox [ref=e49]: Admin
          - generic [ref=e50]:
            - generic [ref=e51]: Email
            - textbox [ref=e52]: asrulazwan90@gmail.com
          - generic [ref=e53]:
            - generic [ref=e54]: Role
            - textbox [ref=e55]: Admin
        - generic [ref=e56]:
          - heading "General" [level=2] [ref=e57]
          - paragraph [ref=e58]: Application settings coming soon.
          - generic [ref=e59]:
            - generic [ref=e60] [cursor=pointer]:
              - checkbox "Email notifications for new listings" [disabled] [ref=e61]
              - text: Email notifications for new listings
            - generic [ref=e62] [cursor=pointer]:
              - checkbox "Email notifications for inquiries" [disabled] [ref=e63]
              - text: Email notifications for inquiries
  - contentinfo [ref=e64]:
    - generic [ref=e65]:
      - generic [ref=e66]:
        - generic [ref=e67]:
          - link "Berry Listings" [ref=e68] [cursor=pointer]:
            - /url: /
            - img [ref=e69]
            - text: Berry Listings
          - paragraph [ref=e73]: A warmer way to browse, buy, and sell property — built for agents who answer their phone.
        - generic [ref=e74]:
          - heading "Explore" [level=4] [ref=e75]
          - list [ref=e76]:
            - listitem [ref=e77]:
              - link "Buy" [ref=e78] [cursor=pointer]:
                - /url: /listings
            - listitem [ref=e79]:
              - link "Rent" [ref=e80] [cursor=pointer]:
                - /url: /listings
            - listitem [ref=e81]:
              - link "Sell with Berry" [ref=e82] [cursor=pointer]:
                - /url: "#"
            - listitem [ref=e83]:
              - link "New developments" [ref=e84] [cursor=pointer]:
                - /url: "#"
        - generic [ref=e85]:
          - heading "Company" [level=4] [ref=e86]
          - list [ref=e87]:
            - listitem [ref=e88]:
              - link "About" [ref=e89] [cursor=pointer]:
                - /url: "#"
            - listitem [ref=e90]:
              - link "Agents" [ref=e91] [cursor=pointer]:
                - /url: "#"
            - listitem [ref=e92]:
              - link "Careers" [ref=e93] [cursor=pointer]:
                - /url: "#"
            - listitem [ref=e94]:
              - link "Contact" [ref=e95] [cursor=pointer]:
                - /url: "#"
        - generic [ref=e96]:
          - heading "Account" [level=4] [ref=e97]
          - list [ref=e98]:
            - listitem [ref=e99]:
              - link "Sign in" [ref=e100] [cursor=pointer]:
                - /url: /login
            - listitem [ref=e101]:
              - link "Agent dashboard" [ref=e102] [cursor=pointer]:
                - /url: /admin
            - listitem [ref=e103]:
              - link "Help center" [ref=e104] [cursor=pointer]:
                - /url: "#"
      - generic [ref=e105]:
        - generic [ref=e106]: © 2026 Berry Listings. All rights reserved.
        - generic [ref=e107]: Made for people, not portals.
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
  22 |     await expect(page.locator('nav[aria-label="Primary"]')).toContainText('Agents', { timeout: 10000 });
  23 |     await expect(page.locator('header .nav__signin')).toBeVisible({ timeout: 10000 });
  24 |   });
  25 | 
  26 |   test('login page renders', async ({ page }) => {
  27 |     await page.goto('/login');
  28 |     await expect(page.locator('input[type="email"]')).toBeVisible();
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
> 50 |     await expect(page.locator('h2')).toContainText('Profile');
     |                                      ^ Error: expect(locator).toContainText(expected) failed
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
  80 |     await expect(page.locator('header')).toContainText('Dashboard', { timeout: 10000 });
  81 |   });
  82 | });
  83 | 
```