import { test, expect } from '@playwright/test';

test.describe('Supply Request Flow', () => {
  let email: string;
  let password = 'Password123!';

  test.beforeEach(async ({ page, request }) => {
    const timestamp = Date.now();
    email = `supplytest_${timestamp}@example.com`;

    const response = await request.post('/api/e2e/seed', {
      data: {
        email,
        password,
        name: 'Test Supply User',
        businesses: [
          { name: 'Supply Business', type: 'RESTAURANT' },
          { name: 'Second Business', type: 'HOTEL' },
        ]
      }
    });
    
    expect(response.ok()).toBeTruthy();

    // Sign in
    await page.goto('/signin');
    await page.getByLabel('Email address').fill(email);
    await page.getByLabel('Password', { exact: true }).fill(password);
    await page.getByRole('button', { name: /sign in/i, exact: true }).click();
    await expect(page).toHaveURL(/.*\/dashboard/);

    // Create 1st location via UI
    await page.goto('/dashboard/locations/new');
    await page.getByLabel(/business/i).selectOption({ label: 'Supply Business' });
    await page.getByLabel(/location name/i).fill('HQ Kitchen');
    await page.getByLabel(/address/i).fill('123 Food St');
    await page.getByLabel(/city/i).fill('London');
    await page.getByRole('button', { name: /create location/i }).click();
    await expect(page).toHaveURL(/.*\/dashboard\/locations/);
    
    // Create 2nd location via UI to prevent auto-select in supply flow
    await page.goto('/dashboard/locations/new');
    await page.getByLabel(/business/i).selectOption({ label: 'Supply Business' });
    await page.getByLabel(/location name/i).fill('Branch Kitchen');
    await page.getByLabel(/address/i).fill('456 Food Ave');
    await page.getByLabel(/city/i).fill('London');
    await page.getByRole('button', { name: /create location/i }).click();
    await expect(page).toHaveURL(/.*\/dashboard\/locations/);
  });

  test('can complete the supply request flow', async ({ page }) => {
    // Navigate to Supply Planner
    await page.goto('/supply');
    
    // Step 1: Select Business (no continue button, just click the business)
    await page.getByText('Supply Business').click();

    // Step 2: Select Location (no continue button, just click the location)
    await page.getByText('HQ Kitchen').click();

    // Step 3: Select Products & Set Quantities
    await expect(page.getByText('Romaine').first()).toBeVisible();
    await page.getByRole('button', { name: 'Add', exact: true }).first().click();
    
    // Quantity control appears after adding, fill it
    await page.getByRole('textbox', { name: 'Romaine quantity', exact: true }).fill('10');
    
    // Continue to next step in planner
    await page.getByRole('button', { name: /continue to delivery details/i }).click();

    // Step 4: Review and Submit
    await expect(page.getByText('Romaine')).toBeVisible();
    await expect(page.getByText('10 kg', { exact: true }).first()).toBeVisible();
    await expect(page.getByText('Supply Business')).toBeVisible();
    await expect(page.getByText('HQ Kitchen')).toBeVisible();
    
    await page.getByRole('button', { name: /submit supply request/i }).click();

    // Confirmation
    await expect(page.getByText(/We have your supply plan/i)).toBeVisible();
  });
});
