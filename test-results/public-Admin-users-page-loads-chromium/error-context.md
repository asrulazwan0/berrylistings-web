# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: public.spec.ts >> Admin >> users page loads
- Location: tests/public.spec.ts:43:3

# Error details

```
Error: expect(locator).toContainText(expected) failed

Locator: locator('td')
Expected substring: "asrulazwan90@gmail.com"
Error: strict mode violation: locator('td') resolved to 20 elements:
    1) <td>…</td> aka getByRole('cell', { name: 'asrulazwan90@gmail.com(you)' })
    2) <td>…</td> aka getByRole('cell', { name: 'ADMIN' })
    3) <td>…</td> aka getByRole('cell', { name: 'Enabled' }).first()
    4) <td>…</td> aka getByRole('cell', { name: '—' })
    5) <td>…</td> aka getByRole('cell', { name: 'demo@berrylistings.local' })
    6) <td>…</td> aka getByRole('cell', { name: 'USER' }).first()
    7) <td>…</td> aka getByRole('cell', { name: 'Enabled' }).nth(1)
    8) <td>…</td> aka getByRole('cell', { name: 'Delete user' }).first()
    9) <td>…</td> aka getByRole('cell', { name: 'e2e-1784212193980@test.com' })
    10) <td>…</td> aka getByRole('cell', { name: 'USER' }).nth(2)
    ...

Call log:
  - Expect "toContainText" with timeout 10000ms
  - waiting for locator('td')

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
          - textbox "new.user@email.com" [ref=e45]
          - button "Add User" [ref=e46] [cursor=pointer]
        - table [ref=e48]:
          - rowgroup [ref=e49]:
            - row "Email Role Status Actions" [ref=e50]:
              - columnheader "Email" [ref=e51]
              - columnheader "Role" [ref=e52]
              - columnheader "Status" [ref=e53]
              - columnheader "Actions" [ref=e54]
          - rowgroup [ref=e55]:
            - row "asrulazwan90@gmail.com(you) ADMIN Enabled —" [ref=e56]:
              - cell "asrulazwan90@gmail.com(you)" [ref=e57]:
                - strong [ref=e58]: asrulazwan90@gmail.com
                - text: (you)
              - cell "ADMIN" [ref=e59]:
                - generic [ref=e60]: ADMIN
              - cell "Enabled" [ref=e61]:
                - generic [ref=e62] [cursor=pointer]: Enabled
              - cell "—" [ref=e63]
            - row "demo@berrylistings.local USER Enabled Delete user" [ref=e64]:
              - cell "demo@berrylistings.local" [ref=e65]:
                - strong [ref=e66]: demo@berrylistings.local
              - cell "USER" [ref=e67]:
                - generic [ref=e68]: USER
              - cell "Enabled" [ref=e69]:
                - button "Enabled" [ref=e70] [cursor=pointer]
              - cell "Delete user" [ref=e71]:
                - button "Delete user" [ref=e72] [cursor=pointer]: ✕
            - row "e2e-1784212193980@test.com USER Enabled Delete user" [ref=e73]:
              - cell "e2e-1784212193980@test.com" [ref=e74]:
                - strong [ref=e75]: e2e-1784212193980@test.com
              - cell "USER" [ref=e76]:
                - generic [ref=e77]: USER
              - cell "Enabled" [ref=e78]:
                - button "Enabled" [ref=e79] [cursor=pointer]
              - cell "Delete user" [ref=e80]:
                - button "Delete user" [ref=e81] [cursor=pointer]: ✕
            - row "e2e-1784212253273@test.com USER Enabled Delete user" [ref=e82]:
              - cell "e2e-1784212253273@test.com" [ref=e83]:
                - strong [ref=e84]: e2e-1784212253273@test.com
              - cell "USER" [ref=e85]:
                - generic [ref=e86]: USER
              - cell "Enabled" [ref=e87]:
                - button "Enabled" [ref=e88] [cursor=pointer]
              - cell "Delete user" [ref=e89]:
                - button "Delete user" [ref=e90] [cursor=pointer]: ✕
            - row "e2e-1784212390244@test.com USER Enabled Delete user" [ref=e91]:
              - cell "e2e-1784212390244@test.com" [ref=e92]:
                - strong [ref=e93]: e2e-1784212390244@test.com
              - cell "USER" [ref=e94]:
                - generic [ref=e95]: USER
              - cell "Enabled" [ref=e96]:
                - button "Enabled" [ref=e97] [cursor=pointer]
              - cell "Delete user" [ref=e98]:
                - button "Delete user" [ref=e99] [cursor=pointer]: ✕
  - contentinfo [ref=e100]:
    - generic [ref=e101]:
      - generic [ref=e102]:
        - generic [ref=e103]:
          - link "Berry Listings" [ref=e104] [cursor=pointer]:
            - /url: /
            - img [ref=e105]
            - text: Berry Listings
          - paragraph [ref=e109]: A warmer way to browse, buy, and sell property — built for agents who answer their phone.
        - generic [ref=e110]:
          - heading "Explore" [level=4] [ref=e111]
          - list [ref=e112]:
            - listitem [ref=e113]:
              - link "Buy" [ref=e114] [cursor=pointer]:
                - /url: /listings
            - listitem [ref=e115]:
              - link "Rent" [ref=e116] [cursor=pointer]:
                - /url: /listings
            - listitem [ref=e117]:
              - link "Sell with Berry" [ref=e118] [cursor=pointer]:
                - /url: "#"
            - listitem [ref=e119]:
              - link "New developments" [ref=e120] [cursor=pointer]:
                - /url: "#"
        - generic [ref=e121]:
          - heading "Company" [level=4] [ref=e122]
          - list [ref=e123]:
            - listitem [ref=e124]:
              - link "About" [ref=e125] [cursor=pointer]:
                - /url: "#"
            - listitem [ref=e126]:
              - link "Agents" [ref=e127] [cursor=pointer]:
                - /url: "#"
            - listitem [ref=e128]:
              - link "Careers" [ref=e129] [cursor=pointer]:
                - /url: "#"
            - listitem [ref=e130]:
              - link "Contact" [ref=e131] [cursor=pointer]:
                - /url: "#"
        - generic [ref=e132]:
          - heading "Account" [level=4] [ref=e133]
          - list [ref=e134]:
            - listitem [ref=e135]:
              - link "Sign in" [ref=e136] [cursor=pointer]:
                - /url: /login
            - listitem [ref=e137]:
              - link "Agent dashboard" [ref=e138] [cursor=pointer]:
                - /url: /admin
            - listitem [ref=e139]:
              - link "Help center" [ref=e140] [cursor=pointer]:
                - /url: "#"
      - generic [ref=e141]:
        - generic [ref=e142]: © 2026 Berry Listings. All rights reserved.
        - generic [ref=e143]: Made for people, not portals.
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
> 45 |     await expect(page.locator('td')).toContainText('asrulazwan90@gmail.com', { timeout: 10000 });
     |                                      ^ Error: expect(locator).toContainText(expected) failed
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
  80 |     await expect(page.locator('header')).toContainText('Dashboard', { timeout: 10000 });
  81 |   });
  82 | });
  83 | 
```