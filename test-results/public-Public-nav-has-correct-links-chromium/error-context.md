# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: public.spec.ts >> Public >> nav has correct links
- Location: tests/public.spec.ts:20:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('header .nav__signin')
Expected: visible
Timeout: 10000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 10000ms
  - waiting for locator('header .nav__signin')

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
- main:
  - text: Curated listings, chosen with care
  - heading "Find a home that feels like you." [level=1]
  - paragraph: Beautiful homes, thoughtfully presented, with local agents who actually pick up the phone.
  - text: 1,240+ Active listings 98% Client satisfaction 18 Cities covered
  - link "View Meadow Land Phase 2, listed at $150,000":
    - /url: /property/cd24befc-f16b-480f-a57f-0d24310511f7
    - img "Meadow Land Phase 2"
    - strong: Meadow Land Phase 2
    - text: Semenyih · 0 bd · 0 ba $150,000
  - form "Search properties":
    - text: Location
    - textbox "Location":
      - /placeholder: City, neighborhood, or ZIP
    - text: Property type
    - combobox "Property type":
      - option "Any type" [selected]
      - option "House"
      - option "Condo"
      - option "Townhome"
      - option "Land"
    - text: Max price
    - combobox "Max price":
      - option "No max" [selected]
      - option "$300,000"
      - option "$500,000"
      - option "$750,000"
      - option "$1,000,000+"
    - button "Search"
  - text: Fresh on the market
  - heading "Featured properties" [level=2]
  - link "View all listings":
    - /url: /listings
  - article:
    - link "Meadow Land Phase 2 For sale $150,000 Meadow Land Phase 2 68 Jalan Example, Semenyih 0 bd 0 ba 0 sqft":
      - /url: /property/cd24befc-f16b-480f-a57f-0d24310511f7
      - img "Meadow Land Phase 2"
      - text: For sale $150,000 Meadow Land Phase 2 68 Jalan Example, Semenyih 0 bd 0 ba 0 sqft
    - button "Save Meadow Land Phase 2"
  - article:
    - link "SkyLoft @ KLCC For sale $950,000 SkyLoft @ KLCC 24 Jalan Example, Kuala Lumpur 2 bd 2 ba 1,100 sqft":
      - /url: /property/510905f2-679d-44a7-90e5-3b740c78d72f
      - img "SkyLoft @ KLCC"
      - text: For sale $950,000 SkyLoft @ KLCC 24 Jalan Example, Kuala Lumpur 2 bd 2 ba 1,100 sqft
    - button "Save SkyLoft @ KLCC"
  - article:
    - link "Maple Residence For sale $1,200,000 Maple Residence 48 Jalan Example, Mont Kiara 6 bd 5 ba 4,800 sqft":
      - /url: /property/94affb99-aa4e-4d10-8741-a11d7b465abe
      - img "Maple Residence"
      - text: For sale $1,200,000 Maple Residence 48 Jalan Example, Mont Kiara 6 bd 5 ba 4,800 sqft
    - button "Save Maple Residence"
  - article:
    - link "Greenfield Lot 42 For sale $280,000 Greenfield Lot 42 5 Jalan Example, Cyberjaya 0 bd 0 ba 0 sqft":
      - /url: /property/e268e6ef-6f4e-4433-ad3b-a0c851e176ba
      - img "Greenfield Lot 42"
      - text: For sale $280,000 Greenfield Lot 42 5 Jalan Example, Cyberjaya 0 bd 0 ba 0 sqft
    - button "Save Greenfield Lot 42"
  - article:
    - 'link "Heritage Townhome #7 For sale $480,000 Heritage Townhome #7 36 Jalan Example, Shah Alam 4 bd 2.5 ba 2,100 sqft"':
      - /url: /property/75c69759-5e03-4997-a7bd-8120994880f9
      - 'img "Heritage Townhome #7"'
      - text: "For sale $480,000 Heritage Townhome #7 36 Jalan Example, Shah Alam 4 bd 2.5 ba 2,100 sqft"
    - 'button "Save Heritage Townhome #7"'
  - article:
    - 'link "The Pearl Residences #12A For sale $620,000 The Pearl Residences #12A 7 Jalan Example, Petaling Jaya 3 bd 2 ba 1,450 sqft"':
      - /url: /property/b1b12c3b-1486-4bee-81e0-50837530542a
      - 'img "The Pearl Residences #12A"'
      - text: "For sale $620,000 The Pearl Residences #12A 7 Jalan Example, Petaling Jaya 3 bd 2 ba 1,450 sqft"
    - 'button "Save The Pearl Residences #12A"'
  - article:
    - link "Sunset Villa For sale $850,000 Sunset Villa 98 Jalan Example, Kuala Lumpur 5 bd 3.5 ba 3,200 sqft":
      - /url: /property/85291cce-7e66-4a6f-bfdb-62287293e71b
      - img "Sunset Villa"
      - text: For sale $850,000 Sunset Villa 98 Jalan Example, Kuala Lumpur 5 bd 3.5 ba 3,200 sqft
    - button "Save Sunset Villa"
  - text: Why Berry
  - heading "A calmer way to find your next place" [level=2]
  - heading "Curated, not crowded" [level=3]
  - paragraph: Every listing is verified and reviewed before it goes live — no stale or duplicate posts.
  - heading "Local agents, real answers" [level=3]
  - paragraph: Talk to the agent behind the listing directly — no call centers, no runaround.
  - heading "List in minutes" [level=3]
  - paragraph: Agents can publish a new property with photos and pricing in one simple flow.
  - heading "Selling a property?" [level=2]
  - paragraph: List with Berry and reach buyers who are actually ready to move.
  - link "Get started":
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
  22 |     await expect(page.locator('nav[aria-label="Primary"]')).toContainText('Agents', { timeout: 10000 });
> 23 |     await expect(page.locator('header .nav__signin')).toBeVisible({ timeout: 10000 });
     |                                                       ^ Error: expect(locator).toBeVisible() failed
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