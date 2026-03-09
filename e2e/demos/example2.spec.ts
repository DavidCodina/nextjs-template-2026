// See here for more on test() : https://playwright.dev/docs/api/class-test
// Also look into test.fixme(), test.slow(), test.only()
import { test, expect } from '@playwright/test'

/* ========================================================================

======================================================================== */
///////////////////////////////////////////////////////////////////////////
//
// You can write Playwright tests without test.step():
//
//   test('PlaywrightDemo toggles hello text and button label', async ({ page }) => {
//
//     await page.goto('/')
//
//     const button = page.getByTestId('button-toggle')
//     await expect(button).toBeVisible()
//     await expect(button).toHaveText('Show')
//     await expect(page.getByTestId('hello-text')).toHaveCount(0)
//
//     await button.click()
//     await expect(button).toHaveText('Hide')
//     const helloText = page.getByTestId('hello-text')
//     await expect(helloText).toBeVisible()
//     await expect(helloText).toHaveText('Hello')
//   })
//
// But when viewing the tests in the UI, it's much cleaner to step through them with
// well-defined steps that clearly indicate what's happening.
//
/////////////////////////
//
// If you only want to run a single test file, you can do something like this:
//
//   npm run test:e2e -- example.spec.ts
//
///////////////////////////////////////////////////////////////////////////

/* ========================================================================

======================================================================== */

// The .use() can be implemented to set custom options for the file or block.
// https://playwright.dev/docs/api/class-test#test-use
// https://playwright.dev/docs/api/class-testoptions
// https://playwright.dev/docs/test-use-options
test.use({})

test.describe('The /test/playwright page...', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/test/playwright')
  })
  // test.afterEach(async ({ page }) => {})
  // test.beforeAll(async ({ page }) => {})
  // test.afterAll(async ({ page }) => {})

  /* ======================
       Test Skipping
  ====================== */
  ///////////////////////////////////////////////////////////////////////////
  //
  // Skip a test entirely:
  //
  //   test.skip('Should have correct document title', async ({ page }) => {
  //     await test.step('Check document title', async () => {
  //       await expect(page).toHaveTitle(/Home/)
  //     })
  //   })
  //
  // Tests can also be skipped per browser:
  //
  ///////////////////////////////////////////////////////////////////////////

  test('Chromium Only', async ({ page, browserName }) => {
    test.skip(browserName !== 'chromium', 'Skipped in Firefox')

    ///////////////////////////////////////////////////////////////////////////
    //
    // By default, the error would be:
    //
    //   Error: Timed out 5000ms waiting for expect(page).toHaveTitle(expected)
    //
    // But we can also customize it. This will then show
    //
    //   Error: Wrong title!
    //   Timed out 5000ms waiting for expect(page).toHaveTitle(expected)
    //
    ///////////////////////////////////////////////////////////////////////////
    await expect(page, 'Wrong title!').toHaveTitle(/Playwright | Demo/)
  })

  /* ======================
      Test For Failures
  ====================== */

  test.fail('Should have correct document title', async ({ page }) => {
    // test.setTimeout(30 * 1000) // Default
    await test.step(`Check document title is NOT 'Welcome'`, async () => {
      await expect(page).toHaveTitle(/Welcome/, {
        timeout: 5 * 1000 // Default
      })
    })
  })

  /* ======================

  ====================== */

  test('should have correct text in <h1>.', async ({ page }) => {
    // This isn't wrong, but it's not specific enough and when we add in Todos.tsx, it
    // ends up matching against three elements.
    //
    // await expect(page.getByText('Playwright')).toBeVisible()
    await expect(page.getByText('PLAYWRIGHT', { exact: true })).toBeVisible()

    await expect(page.getByRole('heading', { name: 'PLAYWRIGHT', exact: true })).toBeVisible()

    // Element's text matches exactly (after whitespace normalization)
    await expect(page.locator('h1', { hasText: 'PLAYWRIGHT' })).toHaveText('PLAYWRIGHT')
    // or
    await expect(page.locator('h1').first()).toHaveText('PLAYWRIGHT')
  })

  /* ======================

  ====================== */
  ///////////////////////////////////////////////////////////////////////////
  //
  // The argument passed to the test callback function would technically be called `fixtures`.
  // However, you Playwright forces you to destructure in place rather than doing.
  // const { page } = fixtures :
  //
  //   ❌ Error: Error: tests/example.spec.ts:82:3: First argument must use the object destructuring pattern...
  //
  // See here for more on fixtures: https://playwright.dev/docs/api/class-fixtures
  // The argument passed to the test function is an object containing all the active
  // fixtures for the test run.
  //
  ///////////////////////////////////////////////////////////////////////////

  // Todo: Uncomment
  // test(
  //   'Should toggle button text and show/hide hello message',
  //   ///////////////////////////////////////////////////////////////////////////
  //   //
  //   // test() can be configured with an optional TestDetails configuration object
  //   // as the second argument.
  //   //
  //   // To run tests by tag you can do this:
  //   //
  //   //   npm run test:e2e -- --grep "@demo"
  //   //
  //   // Or you can do it all using npx. Here's an example of runing the test with the report:
  //   //
  //   //   npx playwright test --grep "@demo" && npx playwright show-report
  //   //
  //   ///////////////////////////////////////////////////////////////////////////
  //   {
  //     tag: '@demo', // Or use an array - ['@demo', '@stuff']
  //     // See Akilesh Rao at 7:45: https://www.youtube.com/watch?v=NvOMwD5Buik&list=PL62km_yqC3ZGHc3qO_CGlvV8bPzt1VZ12&index=4
  //     annotation: {
  //       type: 'issue',
  //       description: "There's an issue..."
  //     }
  //   },
  //   async ({ page /*, context, browser */ }) => {
  //     ///////////////////////////////////////////////////////////////////////////
  //     //
  //     // ⚠️ The getByTestId() is NOT actually coming from React Testing Library.
  //     //
  //     // Not sure what the best way to get a particular element is?
  //     // Run Playwright in UI mode, then click on the target icon 🎯.
  //     // Then click on an element. The locator panel will then show you the best
  //     // way to target that element. Better yet, run Playwright in codegen mode:
  //     //
  //     //   "test:e2e:codegen": "playwright codegen http://localhost:3000",
  //     //
  //     // Alternatively, you can go to the VS Code side panel, click on the testing tab,
  //     // click on the Playwright section and then click on the "Pick Locator" tool.
  //     // This is perhaps the most conventient approach.
  //     //
  //     // See Akilesh Rao at 8:15 for more info:
  //     // https://www.youtube.com/watch?v=g2K2fgLnB9k&list=PL62km_yqC3ZGHc3qO_CGlvV8bPzt1VZ12&index=3
  //     //
  //     ///////////////////////////////////////////////////////////////////////////
  //     const button = page.getByTestId('button-toggle')

  //     ///////////////////////////////////////////////////////////////////////////
  //     //
  //     // To pause or not to pause? 🤔
  //     //
  //     // https://playwright.dev/docs/api/class-page#page-pause
  //     //
  //     //   await page.pause()
  //     //
  //     // In package.json we have this script for a headed test:
  //     //
  //     //   "test:e2e:headed": "PLAYWRIGHT_SLOW_MO=1000 playwright test --headed"
  //     //
  //     // In that case, await page.pause() will cause a GUI debugger window to open.
  //     // Conversely, in headless mode, page.pause() is essentially ignored and the
  //     // test continues executing without stopping.
  //     //
  //     // In UI mode, await page.pause() is essentially redundant because it already
  //     // provides a debugging feature.
  //     //
  //     // In general, I don't tend to use page.pause() or headed mode because the UI mode
  //     // already provides a visual representation of the browser state as well as a debugger.
  //     // Alternatively, running Playwright in debug mode will also open up a browswer window
  //     // and debugger GUI, so page.pause() is probably never needed.
  //     //
  //     //   "test:e2e:debug": "playwright test --debug"
  //     //
  //     // Finally, it's best to not leave page.pause() in the code, and only add it in
  //     // temporarily when debugging.
  //     //
  //     ///////////////////////////////////////////////////////////////////////////

  //     await test.step('Check initial button state', async () => {
  //       // See here for more on assertions:
  //       // https://playwright.dev/docs/test-assertions
  //       await expect(button).toBeVisible()
  //       await expect(button).toHaveText('Show')
  //       // The hello text should NOT be in the DOM initially
  //       await expect(page.getByTestId('hello-text')).toHaveCount(0)
  //     })

  //     await test.step('Click button and check results', async () => {
  //       await button.click()

  //       await expect(button).toHaveText('Hide')
  //       const helloText = page.getByTestId('hello-text')
  //       await expect(helloText).toBeVisible()
  //       await expect(helloText).toHaveText('Hello')
  //     })
  //   }
  // )

  /* ======================
       
  ====================== */

  // Todo: Review Akilesh Rao tutorial part 6 at 4:15 where he demos page.route() and route.fulfill().
  //# mocking API requests: https://www.youtube.com/watch?v=AlGJbl8wsH8&list=PL62km_yqC3ZGHc3qO_CGlvV8bPzt1VZ12&index=6
  //# Actually, create a separate test file for this, and then test it against posts.
})

/* ========================================================================
                            Interaction Cheatsheet
===========================================================================
See here for more on actions: https://playwright.dev/docs/input

Some of these methods may look like DOM methods (i.e., .click()).
However, they are actually Playwright-specific methods that exist on 
Playwright's special element handles and locators, not on regular DOM elements.

Thus when you do this:

  const button = page.getByTestId('button-toggle')

You're not actually getting back a regular DOM node.
Instead, you’re getting a Playwright Locator object.
And the .click() is coming from the Locator object, not the DOM node.

See here for more on the Locator class:
https://playwright.dev/docs/api/class-locator


Note: It's important to distinguish between the idea of a "Locator object"
(i.e., the result of a locator function), and a locator function. For example, 
Playwright refers to the following locators. These look very similar to React 
Testing Library's query functions, but are actually built into Playwright 
(https://playwright.dev/docs/locators) :

   - page.getByRole() to locate by explicit and implicit accessibility attributes.
   - page.getByText() to locate by text content.
   - page.getByLabel() to locate a form control by associated label's text.
   - page.getByPlaceholder() to locate an input by placeholder.
   - page.getByAltText() to locate an element, usually image, by its text alternative.
   - page.getByTitle() to locate an element by its title attribute.
   - page.getByTestId() to locate an element based on its data-testid attribute (other attributes can be configured).


Again, in RTL query functions return DOM nodes. Conversely, in Playwright locator
functions return locator objects. Here are some example interactions that can be
implemented using locator objects:


1. Clicking

  const button = page.getByTestId('my-button')
  await button.click()


2. Filling Inputs

  const input = page.getByPlaceholder('First Name...')
  await input.fill('David')


3. Typing (with delays, like a real user)

  const input = page.getByLabel('Email')
  await input.type('david@example.com', { delay: 100 }) // 100ms per char


4. Clearing an Input

  const input = page.getByLabel('Username')
  await input.fill('') 


5. Selecting from a Dropdown


  const select = page.getByLabel('Country')
  await select.selectOption('usa') // by value
  // or
  await select.selectOption({ label: 'United States' })


6. Checking/Unchecking a Checkbox

  const checkbox = page.getByLabel('Accept Terms')
  await checkbox.check()
  await checkbox.uncheck()


7. Radio Buttons

  const radio = page.getByLabel('Male')
  await radio.check()


8. Hovering

  const menu = page.getByText('Settings')
  await menu.hover()


9. Focusing/Blurring

  const input = page.getByLabel('Search')
  await input.focus()
  await input.blur()


10. Pressing Keys

  const input = page.getByLabel('Search')
  await input.press('Enter')
  await input.press('ArrowDown')


11. Dragging and Dropping

  const source = page.getByTestId('drag-source')
  const target = page.getByTestId('drop-target')
  await source.dragTo(target)


12. Scrolling

  await page.mouse.wheel(0, 500) // scroll down 500px


13. Double Click

  const item = page.getByText('Open')
  await item.dblclick()


14. Right Click (Context Menu)

  const item = page.getByText('Options')
  await item.click({ button: 'right' })

*/
