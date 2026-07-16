# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: public.spec.ts >> Admin >> settings page loads
- Location: tests/public.spec.ts:71:3

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
  1   | import { test, expect } from '@playwright/test';
  2   | 
  3   | async function loginAsAdmin(page) {
  4   |   // Use API directly to get token, then set localStorage
  5   |   const res = await page.request.post('http://localhost:3000/api/v1/auth/dev-login', {
  6   |     data: { email: 'asrulazwan90@gmail.com' },
> 7   |   });
      |              ^ TimeoutError: page.waitForSelector: Timeout 10000ms exceeded.
  8   |   const { data } = await res.json();
  9   |   await page.goto('/');
  10  |   await page.evaluate(({ token, user }) => {
  11  |     localStorage.setItem('berry_jwt', token);
  12  |     localStorage.setItem('berry_user', JSON.stringify(user));
  13  |   }, { token: data.token, user: { name: 'Admin', email: 'asrulazwan90@gmail.com', role: 'ADMIN' } });
  14  | }
  15  | 
  16  | test.describe('Public Site', () => {
  17  |   test('homepage loads', async ({ page }) => {
  18  |     await page.goto('/');
  19  |     await expect(page.locator('h1')).toContainText('Find a home');
  20  |     await expect(page.locator('.property-card').first()).toBeVisible({ timeout: 10000 });
  21  |   });
  22  | 
  23  |   test('listings page shows properties', async ({ page }) => {
  24  |     await page.goto('/listings');
  25  |     await expect(page.locator('.property-card').first()).toBeVisible({ timeout: 10000 });
  26  |   });
  27  | 
  28  |   test('property detail page loads', async ({ page }) => {
  29  |     await page.goto('/listings');
  30  |     await page.locator('.property-card__link').first().click();
  31  |     await expect(page.locator('h1').first()).toBeVisible({ timeout: 10000 });
  32  |   });
  33  | 
  34  |   test('nav has correct public links', async ({ page }) => {
  35  |     await page.goto('/');
  36  |     await expect(page.locator('nav[aria-label="Primary"]')).toContainText('Sell with Berry');
  37  |     await expect(page.locator('nav[aria-label="Primary"]')).toContainText('Agents');
  38  |     await expect(page.locator('header .nav__signin')).toBeVisible();
  39  |   });
  40  | 
  41  |   test('footer exists', async ({ page }) => {
  42  |     await page.goto('/');
  43  |     await expect(page.locator('footer, [class*="footer"]').first()).toBeVisible({ timeout: 5000 });
  44  |   });
  45  | });
  46  | 
  47  | test.describe('Auth', () => {
  48  |   test('login page renders', async ({ page }) => {
  49  |     await page.goto('/login');
  50  |     await expect(page.locator('input[type="email"]')).toBeVisible();
  51  |     await expect(page.locator('button:has-text("Sign in as Admin")')).toBeVisible();
  52  |   });
  53  | 
  54  |   test('nav hides sign-in when authenticated', async ({ page }) => {
  55  |     await loginAsAdmin(page);
  56  |     await page.goto('/');
  57  |     await expect(page.locator('header .nav__signin')).not.toBeVisible();
  58  |     await expect(page.locator('header')).toContainText('Dashboard');
  59  |   });
  60  | });
  61  | 
  62  | test.describe('Admin', () => {
  63  |   test.beforeEach(async ({ page }) => { await loginAsAdmin(page); });
  64  | 
  65  |   test('overview shows stats', async ({ page }) => {
  66  |     await page.goto('/admin');
  67  |     await expect(page.locator('.stat-card').first()).toBeVisible({ timeout: 5000 });
  68  |   });
  69  | 
  70  |   test('listings shows table', async ({ page }) => {
  71  |     await page.goto('/admin/listings');
  72  |     await expect(page.locator('.data-table')).toBeVisible({ timeout: 5000 });
  73  |   });
  74  | 
  75  |   test('users page loads', async ({ page }) => {
  76  |     await page.goto('/admin/users');
  77  |     await expect(page.locator('h1')).toContainText('Users');
  78  |   });
  79  | 
  80  |   test('settings page loads', async ({ page }) => {
  81  |     await page.goto('/admin/settings');
  82  |     await expect(page.locator('h2')).toContainText('Profile');
  83  |   });
  84  | 
  85  |   test('cannot disable self', async ({ page }) => {
  86  |     await page.goto('/admin/users');
  87  |     const myRow = page.locator('tr:has-text("(you)")');
  88  |     await expect(myRow).toBeVisible({ timeout: 5000 });
  89  |     await expect(myRow.locator('button.chip')).not.toBeVisible();
  90  |   });
  91  | });
  92  | 
  93  | test.describe('Admin CRUD', () => {
  94  |   test.beforeEach(async ({ page }) => { await loginAsAdmin(page); });
  95  | 
  96  |   test('new listing form opens and closes', async ({ page }) => {
  97  |     await page.goto('/admin/listings');
  98  |     await page.locator('button:has-text("New listing")').click();
  99  |     await expect(page.locator('.modal-panel')).toBeVisible({ timeout: 5000 });
  100 |     await page.locator('button:has-text("Cancel")').click();
  101 |     await expect(page.locator('.modal-panel')).not.toBeVisible();
  102 |   });
  103 | 
  104 |   test('delete confirmation shows', async ({ page }) => {
  105 |     await page.goto('/admin/listings');
  106 |     await page.locator('button[aria-label="Delete listing"]').first().click();
  107 |     await expect(page.locator('button[aria-label="Confirm delete"]').first()).toBeVisible({ timeout: 3000 });
```