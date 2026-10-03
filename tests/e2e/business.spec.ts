import { test, expect } from '@playwright/test';

test.describe('Business Management', () => {
  let email: string;
  let password = 'Password123!';

  test.beforeEach(async ({ page, request }) => {
    const timestamp = Date.now();
    email = `businesstest_${timestamp}@example.com`;

    const response = await request.post('/api/e2e/seed', {
      data: {
        email,
        password,
        name: 'Test Business User'
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

  test('can create multiple businesses and see them separated', async ({ page }) => {
    // Navigate to Businesses page
    await page.goto('/dashboard/businesses');
    
    // Create Business A
    await page.getByRole('link', { name: /add business/i }).click();
    await page.getByLabel(/business name/i).fill('Alpha Corp');
    await page.getByRole('button', { name: /create business/i }).click();
    
    // Should be redirected back to businesses page or the new business details
    await expect(page).toHaveURL(/.*\/dashboard\/businesses/);
    await expect(page.getByText('Alpha Corp')).toBeVisible();

    // Go back to list if not already there
    await page.goto('/dashboard/businesses');

    // Create Business B
    await page.getByRole('link', { name: /add business/i }).click();
    await page.getByLabel(/business name/i).fill('Beta Corp');
    await page.getByRole('button', { name: /create business/i }).click();

    // Verify both are present on the list page
    await page.goto('/dashboard/businesses');
    await expect(page.getByText('Alpha Corp')).toBeVisible();
    await expect(page.getByText('Beta Corp')).toBeVisible();
  });
});
