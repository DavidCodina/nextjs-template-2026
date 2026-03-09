// See here for more on test() : https://playwright.dev/docs/api/class-test
// Also look into test.fixme(), test.slow(), test.only()
import { test, expect } from '@playwright/test'
import { PlaywrightPage } from './PlaywrightPage'

// const todoPage = '/test/playwright'

/* ========================================================================

======================================================================== */
// Note: many of the test in this file are dependent on the state of the
// initial todo list having particular todo items on mount. Normally, that
// would be a bad testing strategy. However, this is just a practice demo.

test.describe('Todo Test Lab', () => {
  test.beforeEach(async ({ page }) => {
    const playwrightPage = new PlaywrightPage(page)

    // This pattern is often referred to as the Page Object Model.
    // The goal is to reduced duplicate code. However, in this case,
    // the only thing it's doing is calling goto()
    await playwrightPage.goto()

    // await page.goto(todoPage)
    // await expect(page.getByTestId('todo-app')).toHaveAttribute('data-hydrated', 'true')
  })

  /* ======================

  ====================== */

  test('shows the page heading and starter todos', async ({ page }) => {
    // Looks for <h1>Todo Test Lab</h1>
    await expect(page.getByRole('heading', { name: 'Todo Test Lab' })).toBeVisible()

    // Looks for <ul aria-label='Todo Items'> then within it for list item text.
    // This is brittle and very dependent on the demos initial state.
    await expect(page.getByRole('list', { name: 'Todo items' })).toContainText('Learn Playwright locators')
    await expect(page.getByRole('list', { name: 'Todo items' })).toContainText('Write an end-to-end test')

    // This is brittle and very dependent on the demos initial state.
    await expect(page.getByText('2 active', { exact: true })).toBeVisible()
  })

  /* ======================

  ====================== */

  test('adds a todo from the form', async ({ page }) => {
    // Get the <input> by the associated <label>'s text. Then inject text.
    await page.getByLabel('New Todo').fill('Assert the empty state.')

    // Get the button with 'Add todo' text and click it.
    await page.getByRole('button', { name: 'Add todo' }).click()

    // Get the list by its aria-label='Todo Items'. Then test for the new list item text
    await expect(page.getByRole('list', { name: 'Todo Items' })).toContainText('Assert the empty state.')

    // Get element by its aria-label={`${activeCount} active todos`}
    // Kind of confusing how getByLabel works. It can get an <input> through a <label>,
    // but also get an element itself through its aria-label.
    // getByLabel is somewhat of a misnomer. It should be getByLabelText (however the label is attached).
    await expect(page.getByLabel('3 active todos')).toBeVisible()
  })

  /* ======================

  ====================== */

  test('does not add blank todos', async ({ page }) => {
    // Click the 'Add Todo' button.
    await page.getByRole('button', { name: 'Add Todo' }).click()

    // Expect that there are still only three list items.
    await expect(page.getByRole('list', { name: 'Todo Items' }).getByRole('listitem')).toHaveCount(3)
  })

  /* ======================

  ====================== */

  test('completes and reactivates a todo', async ({ page }) => {
    // This is brittle and very dependent on the demos initial state.
    // Get todo item with text of: 'Write an end-to-end test'
    const todo = page.getByRole('listitem').filter({ hasText: 'Write an end-to-end test' })
    // Get that todo's   <input type='checkbox'>
    const checkbox = todo.getByRole('checkbox')

    // Check that checkbox.
    await checkbox.check()

    // Expect that it's now checked.
    await expect(checkbox).toBeChecked()

    // Expect that Tailwind 'line-through' class was added to associated element (<span>).
    await expect(todo.getByText('Write an end-to-end test')).toHaveClass(/line-through/)

    // Expect the associated tag (<span>) to render text of '1 active'.
    await expect(page.getByText('1 active', { exact: true })).toBeVisible()

    // Uncheck the checkbox
    await checkbox.uncheck()

    await expect(checkbox).not.toBeChecked()
  })

  /* ======================

  ====================== */

  test('filters active and completed todos', async ({ page }) => {
    // Click the 'Active' button to filter by active items.
    await page.getByRole('button', { name: 'active', exact: true }).click()

    // Expect that the following two items will be present because they are unchecked.
    await expect(page.getByRole('list', { name: 'Todo Items' })).toContainText('Write an end-to-end test')
    await expect(page.getByRole('list', { name: 'Todo Items' })).not.toContainText('Learn Playwright locators')

    // Click the 'Completed' button to filter by completed items.
    await page.getByRole('button', { name: 'completed', exact: true }).click()

    // Expect that the following item to be present because it is checked.
    await expect(page.getByRole('list', { name: 'Todo Items' })).toContainText('Learn Playwright locators')

    // Expect that the following unchecked item to not be present.
    await expect(page.getByRole('list', { name: 'Todo Items' })).not.toContainText('Run the test suite')
  })

  /* ======================

  ====================== */

  test('deletes a todo', async ({ page }) => {
    // Get the button by its role +  aria-label - i.e., aria-label={`Delete ${todo.title}`}
    // Then click it.
    await page.getByRole('button', { name: 'Delete Run the test suite' }).click()

    // Expect that the associated item will no longer be there.
    await expect(page.getByRole('list', { name: 'Todo items' })).not.toContainText('Run the test suite')
  })

  /* ======================

  ====================== */

  test('clears all completed todos', async ({ page }) => {
    // Get the button for clearing all of the completed todo items and then click it.
    await page.getByRole('button', { name: 'Clear Completed' }).click()

    // Expect the previously checked items to no longer exist in the UI.
    await expect(page.getByRole('list', { name: 'Todo items' })).not.toContainText('Learn Playwright locators')

    // Expect there to only be to remaining items.
    await expect(page.getByRole('list', { name: 'Todo items' }).getByRole('listitem')).toHaveCount(2)
  })

  /* ======================

  ====================== */

  test('shows an empty state when a filter has no matches', async ({ page }) => {
    // Get the button to filter by completed items and click it.
    await page.getByRole('button', { name: 'completed', exact: true }).click()

    // Get the button that deelets the item for the associted expected completed item and click it.
    await page.getByRole('button', { name: 'Delete Learn Playwright locators' }).click()

    // Expect the UI to render the empty list UI: "No todos in this view."
    await expect(page.getByText('No todos in this view.')).toBeVisible()
  })

  ///////////////////////////////////////////////////////////////////////////
  //
  // https://www.udemy.com/course/playwright-from-zero-to-hero/learn/lecture/57336007#overview
  // In VS Code's Playwright extension, check Settings -> Show browser
  // Press play for this test
  // In VS Code extension, check Tools -> Pick locator
  // Then check "Copy on pick" in the Playwright tab below.
  // Now it's on your clipboard!
  //
  // An alternative approach is to generate the entire test.
  // Click on Tools -> Record New
  // In this case, it will create a new .spec.ts file.
  //
  ///////////////////////////////////////////////////////////////////////////

  test('generate test', async ({ page }) => {
    await page.getByRole('textbox', { name: 'New Todo' }).fill('Eat cheese')
    await page.getByRole('button', { name: 'Add Todo' }).click()
    await expect(page.getByRole('list', { name: 'Todo items' })).toContainText('Eat cheese')
  })
})
