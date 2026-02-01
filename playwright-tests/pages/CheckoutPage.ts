import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class CheckoutPage extends BasePage {
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly addressInput: Locator;
  readonly cityInput: Locator;
  readonly zipInput: Locator;
  
  readonly cardNameInput: Locator;
  readonly cardNumberInput: Locator;
  readonly expiryInput: Locator;
  readonly cvvInput: Locator;

  readonly submitButton: Locator;

  constructor(page: Page) {
    super(page);
    this.firstNameInput = page.getByLabel('First Name');
    this.lastNameInput = page.getByLabel('Last Name');
    this.addressInput = page.getByLabel('Address');
    this.cityInput = page.getByLabel('City');
    this.zipInput = page.getByLabel('ZIP Code');
    
    this.cardNameInput = page.getByLabel('Card Name');
    this.cardNumberInput = page.getByLabel('Card Number');
    this.expiryInput = page.getByLabel('Expiry Date');
    this.cvvInput = page.getByLabel('CVV');
    
    this.submitButton = page.getByRole('button', { name: /Pay/ });
  }

  async fillForm(details: { 
    firstName: string; 
    lastName: string; 
    address: string; 
    city: string;
    zip: string;
    cardName: string;
    cardNumber: string;
    expiry: string;
    cvv: string;
  }) {
    await this.firstNameInput.fill(details.firstName);
    await this.lastNameInput.fill(details.lastName);
    await this.addressInput.fill(details.address);
    await this.cityInput.fill(details.city);
    await this.zipInput.fill(details.zip);
    
    await this.cardNameInput.fill(details.cardName);
    await this.cardNumberInput.fill(details.cardNumber);
    await this.expiryInput.fill(details.expiry);
    await this.cvvInput.fill(details.cvv);
  }

  async submitOrder() {
    await this.submitButton.click();
  }
}
