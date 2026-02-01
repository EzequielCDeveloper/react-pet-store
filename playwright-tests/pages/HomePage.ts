import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class HomePage extends BasePage {
  readonly petGrid: Locator;
  readonly availableFilter: Locator;
  readonly pendingFilter: Locator;
  readonly soldFilter: Locator;
  readonly searchInput: Locator;
  
  // Tag Mode elements
  readonly tagsModeButton: Locator;
  readonly statusModeButton: Locator;
  readonly tagInput: Locator;
  readonly addTagButton: Locator;

  constructor(page: Page) {
    super(page);
    // Use test id for more robust selection
    this.petGrid = page.getByTestId('pet-grid');
    this.availableFilter = page.getByRole('checkbox', { name: /available/i });
    this.pendingFilter = page.getByRole('checkbox', { name: /pending/i });
    this.soldFilter = page.getByRole('checkbox', { name: /sold/i });
    this.searchInput = page.getByPlaceholder('Search pets...');
    
    this.tagsModeButton = page.getByRole('button', { name: 'Tags' });
    this.statusModeButton = page.getByRole('button', { name: 'Status' });
    this.tagInput = page.getByPlaceholder('e.g. dog, cat');
    this.addTagButton = page.getByRole('button', { name: 'Add Tag' });
  }

  async goto() {
    await this.navigate('/');
  }

  async selectTagsMode() {
    await this.tagsModeButton.click();
  }

  async addTagFilter(tag: string) {
    await this.tagInput.fill(tag);
    await this.addTagButton.click();
  }

  async getPetCard(name: string) {
    return this.page.getByRole('article').filter({ has: this.page.getByRole('heading', { name: name }) });
  }

  async clickPet(name: string) {
    const card = await this.getPetCard(name);
    // Click the overlay link
    await card.getByRole('link', { name: new RegExp(`View ${name}`, 'i') }).click();
  }

  async addToCart(name: string) {
     const card = await this.getPetCard(name);
     await card.getByRole('button', { name: 'Add to Cart' }).click();
  }
}
