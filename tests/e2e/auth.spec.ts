import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test('redirects to signin when accessing protected route', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page).toHaveURL(/.*\/signin.*/);
  });

  test('user can sign up and is redirected to OTP', async ({ page }) => {
    const timestamp = Date.now();
    const email = `testuser_${timestamp}@example.com`;
    const password = 'Password123!';

    await page.goto('/signup');
    await page.getByLabel('Full Name').fill('Test User');
    await page.getByLabel('Email address').fill(email);
    await page.getByLabel('Password', { exact: true }).fill(password);
    await page.getByLabel('Confirm Password').fill(password);
    await page.getByRole('button', { name: /create account/i }).click();

    await expect(page).toHaveURL(/.*\/verify-otp.*/);
    await expect(page.getByText(/check your email/i)).toBeVisible();
  });

  test('user can sign in and access dashboard', async ({ page, request }) => {
    const timestamp = Date.now();
    const email = `testsignin_${timestamp}@example.com`;
    const password = 'Password123!';

    const response = await request.post('/api/e2e/seed', {
      data: {
        email,
        password,
        name: 'Test Signin User'
      }
    });
    
    expect(response.ok()).toBeTruthy();

    await page.goto('/signin');
    await page.getByLabel('Email address').fill(email);
    await page.getByLabel('Password', { exact: true }).fill(password);
    await page.getByRole('button', { name: /sign in/i, exact: true }).click();
    
    await expect(page).toHaveURL(/.*\/dashboard/);
    await expect(page.getByRole('heading', { name: /Welcome back/i })).toBeVisible();
  });
});
