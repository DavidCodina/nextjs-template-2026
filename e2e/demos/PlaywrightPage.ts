import {
  // test,
  expect
} from '@playwright/test'
import type { Page } from '@playwright/test'

/* ========================================================================

======================================================================== */
// https://playwright.dev/docs/pom

export class PlaywrightPage {
  readonly page: Page
  constructor(page: Page) {
    this.page = page
  }

  async goto() {
    await this.page.goto('/test/playwright')
    await expect(this.page.getByTestId('todo-app')).toHaveAttribute('data-hydrated', 'true')
  }
}
