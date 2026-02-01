import { test, expect } from '@playwright/test';
import { mockPets } from '../fixtures/mock-data';

test.describe('Wishlist Functionality (Mocked API)', () => {
  test.beforeEach(async ({ page }) => {
    // 1. Mock the image generation to avoid 404s from loremflickr
    await page.route('**/*.jpg', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'image/jpeg',
        body: Buffer.from(''), // Empty image
      });
    });

    // 2. Mock the Pets API (so we have consistent data)
    await page.route('**/pet/findByStatus*', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockPets),
      });
    });

    // 3. Mock the Wishlist API (GET) - Initial state: Pet ID 1 is favorited
    await page.route('**/user/wishlist', async (route) => {
      if (route.request().method() === 'GET') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify([1]),
        });
      } else {
        await route.continue();
      }
    });

    // Navigate to home page
    await page.goto('/');
  });

  test('should display initial favorite status correctly', async ({ page }) => {
    // Buddy (ID 1) should be favorited (Red Heart)
    const buddyHeart = page.getByTestId('favorite-btn-1').locator('svg');
    await expect(buddyHeart).toHaveClass(/text-red-500/);

    // Mittens (ID 2) should NOT be favorited (Gray Heart)
    const mittensHeart = page.getByTestId('favorite-btn-2').locator('svg');
    await expect(mittensHeart).not.toHaveClass(/text-red-500/);
    await expect(mittensHeart).toHaveClass(/text-gray-400/);
  });

  test('should add a pet to favorites (Mocked POST)', async ({ page }) => {
    // Mock the POST request
    let postRequestMade = false;
    await page.route('**/user/wishlist/2', async (route) => {
      if (route.request().method() === 'POST') {
        postRequestMade = true;
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ success: true }),
        });
      } else {
        await route.continue();
      }
    });

    // Click heart on Mittens (ID 2)
    await page.getByTestId('favorite-btn-2').click();

    // Verify UI update
    const mittensHeart = page.getByTestId('favorite-btn-2').locator('svg');
    await expect(mittensHeart).toHaveClass(/text-red-500/);

    // Verify request was made
    expect(postRequestMade).toBe(true);

    // Verify Toast
    await expect(page.getByText('Added to favorites')).toBeVisible();
  });

  test('should remove a pet from favorites (Mocked DELETE)', async ({ page }) => {
    // Mock the DELETE request
    let deleteRequestMade = false;
    await page.route('**/user/wishlist/1', async (route) => {
      if (route.request().method() === 'DELETE') {
        deleteRequestMade = true;
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ success: true }),
        });
      } else {
        await route.continue();
      }
    });

    // Click heart on Buddy (ID 1)
    await page.getByTestId('favorite-btn-1').click();

    // Verify UI update
    const buddyHeart = page.getByTestId('favorite-btn-1').locator('svg');
    await expect(buddyHeart).toHaveClass(/text-gray-400/);
    await expect(buddyHeart).not.toHaveClass(/text-red-500/);

    // Verify request was made
    expect(deleteRequestMade).toBe(true);

    // Verify Toast
    await expect(page.getByText('Removed from favorites')).toBeVisible();
  });
});
