import { Page } from '@playwright/test';

export class BasePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async navigate(path: string) {
    await this.page.goto(path);
  }

  async getTitle() {
    return await this.page.title();
  }
  
  async waitForUrl(url: string | RegExp) {
    await this.page.waitForURL(url);
  }
}
