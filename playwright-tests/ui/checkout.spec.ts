import { test, expect } from '@playwright/test';
import { CheckoutPage } from '../pages/CheckoutPage';
import { HomePage } from '../pages/HomePage';
import { mockPets } from '../fixtures/mock-data';

test.describe('Checkout Flow UI Tests', () => {
  let checkoutPage: CheckoutPage;
  let homePage: HomePage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    checkoutPage = new CheckoutPage(page);

    // Mock the API response for pets
    await page.route('**/pet/findByStatus*', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockPets),
      });
    });
    
    // Mock the Order API
    await page.route('**/store/order', async (route) => {
        await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({ id: 123, status: 'placed' })
        });
    });

    // Mock images
    await page.route('**/*.jpg', route => route.fulfill({ status: 200, contentType: 'image/jpeg', body: Buffer.from('') }));
    await page.route('**/*.png', route => route.fulfill({ status: 200, contentType: 'image/png', body: Buffer.from('') }));
    await page.route(/loremflickr/, route => route.fulfill({ status: 200, contentType: 'image/jpeg', body: Buffer.from('') }));

    await homePage.goto();
  });

  test('@ui complete checkout flow', async ({ page }) => {
    // 1. Add to cart
    await homePage.addToCart('Buddy');
    
    // 2. Go to Cart 
    await page.getByRole('link', { name: /cart/i }).click();
    await expect(page).toHaveURL('/cart');

    // 3. Proceed to Checkout
    await page.getByRole('button', { name: 'Proceed to Checkout' }).click();
    await expect(page).toHaveURL('/checkout');
    
    // 4. Fill Form
    await checkoutPage.fillForm({
        firstName: 'John',
        lastName: 'Doe',
        address: '123 Test St',
        city: 'Test City',
        zip: '12345',
        cardName: 'John Doe',
        cardNumber: '1234123412341234',
        expiry: '12/25',
        cvv: '123'
    });
    
    // 5. Submit
    await checkoutPage.submitOrder();
    
    // 6. Verify Success
    await expect(page.getByText('Failed to place order')).not.toBeVisible();
    // Check for success message
    await expect(page.getByRole('heading', { name: 'Order Confirmed!' })).toBeVisible({ timeout: 15000 });
  });
});
