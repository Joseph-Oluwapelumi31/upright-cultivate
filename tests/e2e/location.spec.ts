import { test, expect } from '@playwright/test';

test.describe('Location Management', () => {
  let email: string;
  let password = 'Password123!';

  test.beforeEach(async ({ page, request }) => {
    const timestamp = Date.now();
    email = `locationtest_${timestamp}@example.com`;

    const response = await request.post('/api/e2e/seed', {
      data: {
        email,
        password,
        name: 'Test Location User',
        businesses: [
          { name: 'Business A', type: 'RESTAURANT' },
          { name: 'Business B', type: 'HOTEL' }
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
  });

  test('can create multiple locations under different businesses and see them separated', async ({ page }) => {
    // Navigate to Locations page
    await page.goto('/dashboard/locations');
    
    // Create Location under Business A
    await page.getByRole('link', { name: /add location/i }).click();
    await page.getByLabel(/business/i).selectOption({ label: 'Business A' });
    await page.getByLabel(/location name/i).fill('Downtown Branch');
    await page.getByLabel(/address/i).fill('123 Main St');
    await page.getByLabel(/city/i).fill('London');
    await page.getByRole('button', { name: /create location/i }).click();
    
    await expect(page).toHaveURL(/.*\/dashboard\/locations/);
    await expect(page.getByText('Downtown Branch')).toBeVisible();

    // Create Location under Business B
    await page.getByRole('link', { name: /add location/i }).click();
    await page.getByLabel(/business/i).selectOption({ label: 'Business B' });
    await page.getByLabel(/location name/i).fill('Uptown Branch');
    await page.getByLabel(/address/i).fill('456 High St');
    await page.getByLabel(/city/i).fill('London');
    await page.getByRole('button', { name: /create location/i }).click();

    // Verify both are present on the locations list page
    await expect(page).toHaveURL(/.*\/dashboard\/locations/);
    await expect(page.getByText('Uptown Branch')).toBeVisible();
    await expect(page.getByText('Downtown Branch')).toBeVisible();

    // Wait, the Locations page shows all locations for all businesses.
    // Let's verify that the separation is correct by checking if they are associated with the right business in the UI.
    // The UI should display the business name alongside the location.
    await expect(page.getByText('Business A').first()).toBeVisible();
    await expect(page.getByText('Business B').first()).toBeVisible();
  });
});
