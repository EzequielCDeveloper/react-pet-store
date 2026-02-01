import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { CheckoutPage } from '../pages/CheckoutPage';

const BASE_API_URL = 'https://petstore.swagger.io/v2';

test.describe('Real API End-to-End Tests', () => {
  let homePage: HomePage;
  let checkoutPage: CheckoutPage;
  let createdPetId: number;
  const uniqueTag = `e2e-tag-${Date.now()}`;
  const petName = `E2E-Dog-${Date.now()}`;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    checkoutPage = new CheckoutPage(page);
  });

  test.afterEach(async ({ request }) => {
    // Clean up
    if (createdPetId) {
      await request.delete(`${BASE_API_URL}/pet/${createdPetId}`);
    }
  });

  test('Full flow: Create Pet (API) -> Find & Buy (UI)', async ({ page, request }) => {
    // 1. Setup: Create a pet via API
    const newPet = {
      id: Date.now(),
      name: petName,
      photoUrls: ['https://loremflickr.com/400/300/dog'],
      status: 'available',
      tags: [{ id: 1, name: uniqueTag }],
      category: { id: 1, name: 'Dogs' }
    };

    const response = await request.post(`${BASE_API_URL}/pet`, { data: newPet });
    expect(response.ok()).toBeTruthy();
    const petData = await response.json();
    createdPetId = petData.id;
    console.log(`Created test pet: ${petName} (ID: ${createdPetId}) with tag: ${uniqueTag}`);

    // 2. UI: Navigate and Find Pet
    await homePage.goto();
    
    // Switch to Tags mode and search
    await homePage.selectTagsMode();
    await homePage.addTagFilter(uniqueTag);

    // Verify pet appears
    const petCard = await homePage.getPetCard(petName);
    await expect(petCard).toBeVisible({ timeout: 10000 }); // Give time for API fetch

    // 3. UI: Add to Cart
    await homePage.addToCart(petName);
    
    // 4. UI: Checkout
    await page.getByRole('link', { name: /cart/i }).click();
    await expect(page).toHaveURL('/cart');
    
    await page.getByRole('button', { name: 'Proceed to Checkout' }).click();
    await expect(page).toHaveURL('/checkout');

    await checkoutPage.fillForm({
        firstName: 'Real',
        lastName: 'User',
        address: '123 Real St',
        city: 'Internet',
        zip: '90210',
        cardName: 'Real User',
        cardNumber: '1234123412341234',
        expiry: '12/30',
        cvv: '123'
    });

    // Note: We submit the order. The real API might return success or fail depending on its mood.
    // Our app handles success.
    // Since we are hitting the REAL /store/order endpoint (via proxy or direct), 
    // we expect the UI to show success if the API works.
    await checkoutPage.submitOrder();
    
    // Check for success message OR error message (if public API is down/limited)
    await expect(page.getByText('Order Confirmed!')).toBeVisible({ timeout: 10000 });
  });

  test('Bug Fix Verification: selecting Sold then Available should show available pets', async ({ page }) => {
    await homePage.goto();
    // 1. Uncheck Available (to start clean)
    await homePage.availableFilter.uncheck();
    
    // 2. Check Sold
    await homePage.soldFilter.check();
    await expect(page.getByRole('status').filter({ hasText: /sold/i }).first()).toBeVisible();

    // 3. Check Available (Resulting state: Sold + Available)
    await homePage.availableFilter.check();

    // 4. Verify Available pets are visible
    await expect(page.getByRole('status').filter({ hasText: /available/i }).first()).toBeVisible({ timeout: 10000 });
  });
});
