// See here for more on test() : https://playwright.dev/docs/api/class-test
// Also look into test.fixme(), test.slow(), test.only()
import { test, expect } from '@playwright/test'

const todoPage = '/test/playwright'

/* ========================================================================

======================================================================== */

test.describe('Todo Test Lab', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(todoPage)
    await expect(page.getByTestId('todo-app')).toHaveAttribute('data-hydrated', 'true')
  })

  /* ======================

  ====================== */

  test('shows the page heading and starter todos', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Todo Test Lab' })).toBeVisible()
    await expect(page.getByRole('list', { name: 'Todo items' })).toContainText('Learn Playwright locators')
    await expect(page.getByRole('list', { name: 'Todo items' })).toContainText('Write an end-to-end test')
    await expect(page.getByText('2 active', { exact: true })).toBeVisible()
  })

  /* ======================

  ====================== */

  test('adds a todo from the form', async ({ page }) => {
    await page.getByLabel('New todo').fill('Assert the empty state')
    await page.getByRole('button', { name: 'Add todo' }).click()
    await expect(page.getByRole('list', { name: 'Todo items' })).toContainText('Assert the empty state')
    await expect(page.getByLabel('3 active todos')).toBeVisible()
  })

  /* ======================

  ====================== */

  test('does not add blank todos', async ({ page }) => {
    await page.getByRole('button', { name: 'Add todo' }).click()
    await expect(page.getByRole('list', { name: 'Todo items' }).getByRole('listitem')).toHaveCount(3)
  })

  /* ======================

  ====================== */

  test('completes and reactivates a todo', async ({ page }) => {
    const todo = page.getByRole('listitem').filter({ hasText: 'Write an end-to-end test' })
    const checkbox = todo.getByRole('checkbox')
    await checkbox.check()
    await expect(checkbox).toBeChecked()
    await expect(todo.getByText('Write an end-to-end test')).toHaveClass(/line-through/)
    await expect(page.getByText('1 active', { exact: true })).toBeVisible()
    await checkbox.uncheck()
    await expect(checkbox).not.toBeChecked()
  })

  /* ======================

  ====================== */

  test('filters active and completed todos', async ({ page }) => {
    await page.getByRole('button', { name: 'active', exact: true }).click()
    await expect(page.getByRole('list', { name: 'Todo items' })).toContainText('Write an end-to-end test')
    await expect(page.getByRole('list', { name: 'Todo items' })).not.toContainText('Learn Playwright locators')

    await page.getByRole('button', { name: 'completed', exact: true }).click()
    await expect(page.getByRole('list', { name: 'Todo items' })).toContainText('Learn Playwright locators')
    await expect(page.getByRole('list', { name: 'Todo items' })).not.toContainText('Run the test suite')
  })

  /* ======================

  ====================== */

  test('deletes a todo', async ({ page }) => {
    await page.getByRole('button', { name: 'Delete Run the test suite' }).click()
    await expect(page.getByRole('list', { name: 'Todo items' })).not.toContainText('Run the test suite')
  })

  /* ======================

  ====================== */

  test('clears all completed todos', async ({ page }) => {
    await page.getByRole('button', { name: 'Clear completed' }).click()
    await expect(page.getByRole('list', { name: 'Todo items' })).not.toContainText('Learn Playwright locators')
    await expect(page.getByRole('list', { name: 'Todo items' }).getByRole('listitem')).toHaveCount(2)
  })

  /* ======================

  ====================== */

  test('shows an empty state when a filter has no matches', async ({ page }) => {
    await page.getByRole('button', { name: 'completed', exact: true }).click()
    await page.getByRole('button', { name: 'Delete Learn Playwright locators' }).click()
    await expect(page.getByText('No todos in this view.')).toBeVisible()
  })
})
