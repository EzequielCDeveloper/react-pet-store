import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';

test.describe('Error Handling & Edge Cases (Mocked)', () => {
  let homePage: HomePage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
  });

  test('displays error message when API fails', async ({ page }) => {
    // Mock 500 Error
    await page.route('**/pet/findByStatus*', async (route) => {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ message: 'Internal Server Error' }),
      });
    });

    await homePage.goto();
    
    // Check for error message in UI
    await expect(page.getByTestId('pet-grid-error')).toBeVisible();
    await expect(page.getByText('Error loading pets')).toBeVisible();
  });

  test('displays empty state when no pets found', async ({ page }) => {
    // Mock Empty List
    await page.route('**/pet/findByStatus*', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([]),
      });
    });
    
    // Mock images
    await page.route('**/*.jpg', route => route.fulfill({ status: 200, contentType: 'image/jpeg', body: Buffer.from('') }));

    await homePage.goto();
    
    await expect(page.getByTestId('pet-grid-empty')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'No pets found' })).toBeVisible();
  });
});
