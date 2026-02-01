import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { mockPets } from '../fixtures/mock-data';

test.describe('Home Page UI Tests', () => {
  let homePage: HomePage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);

    // Mock the API response
    await page.route(/.*\/pet\/findByStatus.*/, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockPets),
      });
    });

    // Mock images to speed up tests and prevent timeouts
    await page.route('**/*.jpg', route => route.fulfill({ status: 200, contentType: 'image/jpeg', body: Buffer.from('') }));
    await page.route('**/*.png', route => route.fulfill({ status: 200, contentType: 'image/png', body: Buffer.from('') }));
    await page.route(/loremflickr/, route => route.fulfill({ status: 200, contentType: 'image/jpeg', body: Buffer.from('') }));

    await homePage.goto();
    // Wait for the grid to be visible instead of networkidle which can be flaky
    try {
      await expect(homePage.petGrid).toBeVisible({ timeout: 10000 });
    } catch (e) {
      if (await page.getByTestId('pet-grid-error').isVisible()) {
        throw new Error('Pet Grid Error State Visible - Check API Mock or Network');
      }
      if (await page.getByTestId('pet-grid-loading').isVisible()) {
        throw new Error('Pet Grid Stuck Loading - Check Mock Response');
      }
      throw e;
    }
  });

  test('displays available pets', async ({ page }) => {
    // Check if the pet name "Buddy" is visible (from mock data)
    await expect(page.getByRole('heading', { name: 'Buddy' })).toBeVisible({ timeout: 10000 });
    await expect(page.getByRole('status').filter({ hasText: /available/i }).first()).toBeVisible();
  });

  test('displays pending and sold status correctly', async ({ page }) => {
    // Enable other filters
    await homePage.pendingFilter.click();
    await homePage.soldFilter.click();

    // Check for "Pending" and "Sold" badges
    await expect(page.getByRole('status').filter({ hasText: /pending/i }).first()).toBeVisible();
    await expect(page.getByRole('status').filter({ hasText: /sold/i }).first()).toBeVisible();
  });

  test('can add available pet to cart', async ({ page }) => {
    await homePage.addToCart('Buddy');

    // Verify toast appears
    await expect(page.getByText('Added to cart!', { exact: false })).toBeVisible();
  });

  test('cannot add sold pet to cart', async () => {
    await homePage.soldFilter.click();
    const soldPetCard = await homePage.getPetCard('Rocky');

    // Ensure the pet card is visible first to avoid false positives (e.g. if the list is empty, the button is also not visible)
    await expect(soldPetCard).toBeVisible();

    // Button should say "Sold" and be disabled or not be "Add to Cart"
    await expect(soldPetCard.getByRole('button', { name: 'Add to Cart' })).not.toBeVisible();
    await expect(soldPetCard.getByRole('status').filter({ hasText: /sold/i })).toBeVisible();
  });

  test('can filter pets by tag', async ({ page }) => {
    // Mock response for tag search
    await page.route(/.*\/pet\/findByTags.*/, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          { id: 4, name: 'TagPet', status: 'available', tags: [{ id: 99, name: 'special-tag' }] }
        ]),
      });
    });

    await homePage.selectTagsMode();
    await homePage.addTagFilter('special-tag');

    // Verify results in grid
    await expect(page.getByRole('heading', { name: 'TagPet' })).toBeVisible();

    // Verify tag is displayed in the filter list (PetFilters component)
    const filtersSection = page.locator('div', { has: page.getByRole('heading', { name: 'Filter By' }) });
    // The tag chip contains the text and a remove button. Checking for the remove button is a robust way to verify the tag's presence.
    await expect(filtersSection.getByRole('button', { name: 'Remove special-tag' })).toBeVisible();

    // Verify tag is displayed on the pet card
    const petCard = await homePage.getPetCard('TagPet');
    await expect(petCard.getByText('special-tag')).toBeVisible();
  });

  test('can search pets by name', async () => {
    // Ensure we are in status mode with all statuses to see all potential matches initially
    await homePage.pendingFilter.click();
    await homePage.soldFilter.click();

    // Verify all pets are visible initially
    await expect(homePage.getPetCard('Buddy')).resolves.toBeVisible();
    await expect(homePage.getPetCard('Mittens')).resolves.toBeVisible();
    await expect(homePage.getPetCard('Rocky')).resolves.toBeVisible();

    // Search for "Buddy"
    await homePage.searchInput.fill('Buddy');

    // Verify "Buddy" is still visible
    await expect(homePage.getPetCard('Buddy')).resolves.toBeVisible();

    // Verify others are hidden
    await expect(homePage.getPetCard('Mittens')).resolves.not.toBeVisible();
    await expect(homePage.getPetCard('Rocky')).resolves.not.toBeVisible();

    // Search for "Rocky"
    await homePage.searchInput.fill('Rocky');
    await expect(homePage.getPetCard('Rocky')).resolves.toBeVisible();
    await expect(homePage.getPetCard('Buddy')).resolves.not.toBeVisible();
  });

  test('requests are sent with sorted status parameters', async ({ page }) => {
    // Intercept and check the request URL
    const requestPromise = page.waitForRequest(request =>
      request.url().includes('/pet/findByStatus') &&
      request.url().includes('status=available') &&
      request.url().includes('status=sold')
    );

    // Trigger the condition: Sold then Available (reverse alphabetical selection)
    await homePage.availableFilter.uncheck();
    await homePage.soldFilter.check(); // "sold"
    await homePage.availableFilter.check(); // "available" (should be sorted to first)

    const request = await requestPromise;
    const url = request.url();

    // Verify "available" comes before "sold" in the URL query string
    const availableIndex = url.indexOf('status=available');
    const soldIndex = url.indexOf('status=sold');

    expect(availableIndex).toBeGreaterThan(-1);
    expect(soldIndex).toBeGreaterThan(-1);
    expect(availableIndex).toBeLessThan(soldIndex);

    // Also verify that the UI updates correctly to show both available and sold pets
    // The mock returns one pet of each status (Available: Buddy, Sold: Rocky)
    await expect(homePage.getPetCard('Buddy')).resolves.toBeVisible();
    await expect(homePage.getPetCard('Rocky')).resolves.toBeVisible();
  });
});
