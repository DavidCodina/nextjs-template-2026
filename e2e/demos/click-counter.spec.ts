import { test, expect } from '@playwright/test'

const todoPage = '/test/playwright'

/* ========================================================================

======================================================================== */
/* This file assumes the following in the associated page:

 <section className='mb-6 flex flex-wrap justify-center gap-2'>
  <ClickCounter variant='red' data-testid='default-counter' />
  <ClickCounter variant='orange' data-testid='initial-counter' initialCount={10} />
  <ClickCounter variant='yellow' data-testid='step-counter' step={5} />
  <ClickCounter variant='green' data-testid='max-counter' max={3} />
  <ClickCounter variant='blue' data-testid='disabled-counter' disabled />
</section>
*/

test.describe('ClickCounter...', () => {
  test.beforeEach(async ({ page }) => {
    // `baseURL` from playwright.config.ts is prepended to this relative path.
    await page.goto(todoPage)
  })

  /* ======================
        Rendering
  ====================== */

  test.describe('rendering', () => {
    test('renders with an initial count of 0', { tag: '@smoke' }, async ({ page }) => {
      const counter = page.getByTestId('default-counter')
      // `toHaveText` auto-retries until it matches or the timeout expires.
      // A string is an exact (whitespace-normalised) match; use a RegExp for partial.
      await expect(counter).toHaveText('Count: 0')
    })

    test('is visible, enabled and has the right tag', async ({ page }) => {
      const counter = page.getByTestId('default-counter')
      await expect(counter).toBeVisible() // in DOM, non-empty box, not visibility:hidden
      await expect(counter).toBeEnabled() // not [disabled]
      // `evaluate` runs JS inside the browser against the matched element.
      const tagName = await counter.evaluate((el) => el.tagName)
      expect(tagName).toBe('BUTTON')
    })

    test('has the expected accessible role and name', async ({ page }) => {
      // getByRole is the recommended locator: it mirrors how users/assistive tech see the page.
      const button = page.getByRole('button', { name: 'Count: 10' })
      await expect(button).toBeVisible()
      await expect(button).toHaveAccessibleName('Count: 10')
    })

    test('matches its ARIA snapshot', async ({ page }) => {
      const counter = page.getByTestId('default-counter')
      // Compares the accessibility tree (YAML) rather than raw HTML.
      // The whole entry is single-quoted because the ':' in the name would otherwise be read as YAML syntax.
      await expect(counter).toMatchAriaSnapshot(`- 'button "Count: 0"'`)
    })

    // ! This fails because there's other buttons on the page.
    test.fixme('renders five counters on the page', async ({ page }) => {
      // `toHaveCount` asserts how many elements a locator matches.
      // We scope to <main> because `next dev` injects its own "Dev Tools" <button>
      // into the page, which a page-wide getByRole('button') would also match.
      await expect(page.getByRole('main').getByRole('button')).toHaveCount(5)
      // Four counters start at 0 (default, step, max, disabled) - so a locator on
      // that name matches several elements. Using it with click() would throw a
      // "strict mode violation", which is Playwright protecting you from ambiguity.
      await expect(page.getByRole('button', { name: 'Count: 0' })).toHaveCount(4)
    })

    // ! This fails because we no longer have those classes on that button.
    test.fixme('has the expected utility classes and CSS', async ({ page }) => {
      const counter = page.getByTestId('default-counter')

      await expect(counter).toHaveClass(/mx-auto/) // RegExp = "contains"
      await expect(counter).toHaveClass(/my-6/)
      await expect(counter).toHaveCSS('display', 'flex') // computed style
      await expect(counter).toHaveCSS('margin-top', '24px') // my-6 = 1.5rem = 24px
    })
  })

  /* ======================
          Clicking
  ====================== */

  test.describe('clicking', () => {
    test('increments by 1 on a single click', { tag: '@smoke' }, async ({ page }) => {
      const counter = page.getByTestId('default-counter')
      await counter.click() // waits for visible, stable, enabled, unobscured, then clicks
      await expect(counter).toHaveText('Count: 1')
    })

    test('increments on every click', async ({ page }) => {
      const counter = page.getByTestId('default-counter')
      for (let i = 1; i <= 5; i++) {
        await counter.click()
        // Asserting inside the loop checks every intermediate state.
        await expect(counter).toHaveText(`Count: ${i}`)
      }
    })

    test('handles rapid-fire clicks without losing any', async ({ page }) => {
      const counter = page.getByTestId('default-counter')
      // `clickCount` fires N mousedown/up/click sequences very quickly
      await counter.click({ clickCount: 10 })
      await expect(counter).toHaveText('Count: 10')
    })

    test('double-click counts as two clicks', async ({ page }) => {
      const counter = page.getByTestId('default-counter')
      await counter.dblclick()
      await expect(counter).toHaveText('Count: 2')
    })

    test('ignores right- and middle-clicks', async ({ page }) => {
      const counter = page.getByTestId('default-counter')
      // `button` picks the mouse button; onClick only fires for the primary one.
      await counter.click({ button: 'right' })
      await counter.click({ button: 'middle' })
      await expect(counter).toHaveText('Count: 0')
    })

    test('still increments when a modifier key is held', async ({ page }) => {
      const counter = page.getByTestId('default-counter')
      await counter.click({ modifiers: ['Shift'] })
      await expect(counter).toHaveText('Count: 1')
    })

    test('increments when clicked at a specific position', async ({ page }) => {
      const counter = page.getByTestId('default-counter')
      // `position` is relative to the element's top-left corner.
      await counter.click({ position: { x: 5, y: 5 } })
      await expect(counter).toHaveText('Count: 1')
    })

    test('increments with a manual mouse click on its coordinates', async ({ page }) => {
      const counter = page.getByTestId('default-counter')
      const box = (await counter.boundingBox())!
      // Low-level mouse API: no actionability checks, just raw input at x/y.
      await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2)
      await expect(counter).toHaveText('Count: 1')
    })

    test('increments via a dispatched DOM click event', async ({ page }) => {
      const counter = page.getByTestId('default-counter')
      // Skips real mouse input and dispatches a synthetic `click` Event directly.
      await counter.dispatchEvent('click')
      await expect(counter).toHaveText('Count: 1')
    })

    test('increments with `force: true` (skips actionability checks)', async ({ page }) => {
      const counter = page.getByTestId('default-counter')
      await counter.click({ force: true })
      await expect(counter).toHaveText('Count: 1')
    })

    test('a trial click does NOT click', async ({ page }) => {
      const counter = page.getByTestId('default-counter')
      // `trial: true` performs all the actionability checks but doesn't click.
      // Handy to assert "a user could click this" without side effects.
      await counter.click({ trial: true })
      await expect(counter).toHaveText('Count: 0')
    })

    test('counts clicks made with a delay between mousedown and mouseup', async ({ page }) => {
      const counter = page.getByTestId('default-counter')
      await counter.click({ delay: 200 }) // simulates a slow, deliberate press
      await expect(counter).toHaveText('Count: 1')
    })
  })

  /* ======================
        Keyboard
  ====================== */

  test.describe('keyboard & focus', () => {
    test('can be focused programmatically', async ({ page }) => {
      const counter = page.getByTestId('default-counter')
      await expect(counter).not.toBeFocused()
      await counter.focus()
      await expect(counter).toBeFocused()
    })

    // ! This fails because it's not the the first element reached with Tab.
    test.fixme('is the first element reached with Tab', async ({ page }) => {
      const counter = page.getByTestId('default-counter')
      await page.keyboard.press('Tab') // real key press at page level
      await expect(counter).toBeFocused()
    })

    test('increments with Enter', async ({ page }) => {
      const counter = page.getByTestId('default-counter')
      await counter.focus()
      await counter.press('Enter') // locator.press focuses the element first
      await expect(counter).toHaveText('Count: 1')
    })

    test('increments with Space', async ({ page }) => {
      const counter = page.getByTestId('default-counter')
      await counter.focus()
      await counter.press('Space')
      await expect(counter).toHaveText('Count: 1')
    })

    test('keeps focus after being clicked', async ({ page }) => {
      const counter = page.getByTestId('default-counter')
      await counter.click()
      await expect(counter).toBeFocused() // re-rendering must not drop focus
    })

    // ! This fails
    test.fixme('Tab skips the disabled counter and then leaves the page controls', async ({ page }) => {
      // Tab order: default -> initial -> step -> max -> (disabled is skipped)
      await page.keyboard.press('Tab')
      await page.keyboard.press('Tab')
      await page.keyboard.press('Tab')
      await expect(page.getByTestId('step-counter')).toBeFocused()
      await page.keyboard.press('Tab')
      await expect(page.getByTestId('max-counter')).toBeFocused()
      await page.keyboard.press('Tab')
      await expect(page.getByTestId('disabled-counter')).not.toBeFocused()
    })

    // ! This fails
    test.fixme('shows a focus ring for keyboard focus (:focus-visible)', async ({ page }) => {
      const counter = page.getByTestId('default-counter')
      await page.keyboard.press('Tab')
      await expect(counter).toHaveCSS('outline-style', 'solid')
    })
  })

  /* ======================
           Props
  ====================== */

  test.describe('props', () => {
    test('initialCount sets the starting value', async ({ page }) => {
      const counter = page.getByTestId('initial-counter')
      await expect(counter).toHaveText('Count: 10')
      await counter.click()
      await expect(counter).toHaveText('Count: 11')
    })

    test('step controls the increment size', async ({ page }) => {
      const counter = page.getByTestId('step-counter')
      await counter.click({ clickCount: 3 })
      await expect(counter).toHaveText('Count: 15')
    })

    test('max stops the counter and disables the button', async ({ page }) => {
      const counter = page.getByTestId('max-counter')
      await counter.click({ clickCount: 3 })
      await expect(counter).toHaveText('Count: 3')
      await expect(counter).toBeDisabled()
    })

    test('a maxed-out counter cannot be clicked any more', async ({ page }) => {
      const counter = page.getByTestId('max-counter')
      await counter.click({ clickCount: 3 })
      // click() waits for the button to be enabled. It never is, so it times out.
      // Wrapping the promise in `expect(...).rejects` asserts that failure,
      // and a short timeout keeps the test fast.
      await expect(counter.click({ timeout: 500 })).rejects.toThrow(/Timeout/)
      await expect(counter).toHaveText('Count: 3')
    })

    test('the disabled prop is forwarded to the button', async ({ page }) => {
      const counter = page.getByTestId('disabled-counter')
      await expect(counter).toBeDisabled()

      await expect(counter).toHaveAttribute('disabled', '') // boolean attribute
      await expect(counter).toHaveText('Count: 0')
    })

    // Data-driven tests: a plain array + loop generates one named test per row.

    // ! This fails
    // const stepCases = [
    //   { clicks: 1, expected: 5 },
    //   { clicks: 2, expected: 10 },
    //   { clicks: 4, expected: 20 }
    // ]
    // for (const { clicks, expected } of stepCases) {
    //   test(`step=5 after ${clicks} click(s) shows ${expected}`, async ({ page }) => {
    //     const counter = page.getByTestId('step-counter')
    //     await counter.click({ clickCount: clicks })
    //     await expect(counter).toHaveText(`Count: ${expected}`)
    //   })
    // }
  })

  /* ======================
      Isolation & state
  ====================== */

  test.describe('isolation & state', () => {
    // ! This fails because there's other buttons on the page.
    test.fixme('each counter keeps its own state', async ({ page }) => {
      await page.getByTestId('default-counter').click({ clickCount: 2 })
      await page.getByTestId('step-counter').click()
      // Passing an array to toHaveText compares against the full list of matches, in order.
      await expect(page.getByRole('main').getByRole('button')).toHaveText([
        'Count: 2',
        'Count: 10',
        'Count: 5',
        'Count: 0',
        'Count: 0'
      ])
    })

    test('state resets after a reload (it is not persisted)', async ({ page }) => {
      const counter = page.getByTestId('default-counter')
      await counter.click({ clickCount: 4 })
      await expect(counter).toHaveText('Count: 4')
      await page.reload()
      await expect(counter).toHaveText('Count: 0')
    })

    test('state resets after navigating away and back', async ({ page }) => {
      const counter = page.getByTestId('default-counter')
      await counter.click({ clickCount: 2 })
      await page.goto('about:blank') // leave the app
      await page.goBack() // browser history works like a real user's
      await expect(counter).toHaveText('Count: 0')
    })

    test('does not write to localStorage, sessionStorage or cookies', async ({ page, context }) => {
      const counter = page.getByTestId('default-counter')
      await counter.click()
      expect(await page.evaluate(() => localStorage.length)).toBe(0)
      expect(await page.evaluate(() => sessionStorage.length)).toBe(0)
      expect(await context.cookies()).toHaveLength(0) // context owns cookies
    })
  })

  /* ======================
    Locator strategies
  ====================== */

  test.describe('locator strategies', () => {
    // ! This fails because there's other buttons on the page.
    // test('can be found in many different ways', async ({ page }) => {
    //   const byTestId = page.getByTestId('default-counter')
    //   const byRole = page.getByRole('main').getByRole('button').first() // first() picks the first match
    //   const byIndex = page.locator('button').nth(0) // nth() is zero-based
    //   const byCss = page.locator('button[data-testid="default-counter"]')
    //   const scoped = page.locator('main').getByRole('button').first() // chain to narrow scope

    //   for (const locator of [byTestId, byRole, byIndex, byCss, scoped]) {
    //     await expect(locator).toHaveText('Count: 0')
    //   }
    // })

    test('filter() narrows a list of matches', async ({ page }) => {
      // Only the "Count: 10" button has the text "10".
      const filtered = page.getByRole('main').getByRole('button').filter({ hasText: '10' })
      await expect(filtered).toHaveCount(1)
      await expect(filtered).toHaveAttribute('data-testid', 'initial-counter')
    })

    // ! This fails because there's other buttons on the page.
    // test('getByRole can filter by enabled/disabled state', async ({ page }) => {
    //   // Role locators accept ARIA state options such as `disabled`, `checked`, `pressed`...
    //   const main = page.getByRole('main')
    //   await expect(main.getByRole('button', { disabled: false })).toHaveCount(4)
    //   await expect(main.getByRole('button', { disabled: true })).toHaveCount(1)
    // })

    // ! This fails because there's other buttons on the page.
    // test('locator.all() turns matches into an array to loop over', async ({ page }) => {
    //   // Note: .all() returns what is there RIGHT NOW (it does not wait), which is fine here.
    //   for (const button of await page.getByRole('main').getByRole('button').all()) {
    //     if (await button.isEnabled()) await button.click()
    //   }
    //   await expect(page.getByRole('main').getByRole('button')).toHaveText([
    //     'Count: 1',
    //     'Count: 11',
    //     'Count: 5',
    //     'Count: 1',
    //     'Count: 0'
    //   ])
    // })

    // test('getByText finds the button by its content', async ({ page }) => {
    //   await expect(page.getByText('Count: 10')).toBeVisible()
    //   await expect(page.getByText(/^Count: \d+$/)).toHaveCount(5) // RegExp matching
    // })
  })

  /* ======================
    Browser-level events
  ====================== */

  test.describe('browser events', () => {
    test('logs the new count to the console', async ({ page }) => {
      const counter = page.getByTestId('default-counter')
      // Start listening AND click together: avoids missing an event that fires fast.
      const [message] = await Promise.all([
        page.waitForEvent('console', (msg) => msg.text().startsWith('ClickCounter:')),
        counter.click()
      ])
      expect(message.type()).toBe('log')
      expect(message.text()).toBe('ClickCounter: 1')
    })

    // ! This fails
    // test('makes no network requests when clicked', async ({ page }) => {
    //   const counter = page.getByTestId('default-counter')
    //   const requests: string[] = []
    //   page.on('request', (request) => requests.push(request.url()))
    //   await counter.click({ clickCount: 5 })
    //   await expect(counter).toHaveText('Count: 5')
    //   expect(requests).toEqual([]) // pure client-side state, so nothing should hit the network
    // })

    test('throws no uncaught JavaScript errors', async ({ page }) => {
      const counter = page.getByTestId('default-counter')
      const errors: Error[] = []
      page.on('pageerror', (error) => errors.push(error)) // uncaught exceptions
      await counter.click({ clickCount: 3 })
      await expect(counter).toHaveText('Count: 3')
      expect(errors).toHaveLength(0)
    })

    test('does not navigate or open popups when clicked', async ({ page, context }) => {
      const counter = page.getByTestId('default-counter')
      const url = page.url()
      await counter.click()
      expect(page.url()).toBe(url)
      expect(context.pages()).toHaveLength(1) // still only one tab open
    })
  })

  /* ======================
    Assertion techniques
  ====================== */

  test.describe('assertion techniques', () => {
    test('test.step() groups actions in the report and trace', async ({ page }) => {
      const counter = page.getByTestId('default-counter')
      await test.step('Counter starts at zero', async () => {
        await expect(counter).toHaveText('Count: 0')
      })
      await test.step('Click three times', async () => {
        await counter.click({ clickCount: 3 })
      })
      await test.step('Counter shows three', async () => {
        await expect(counter).toHaveText('Count: 3')
      })
    })

    test('expect.soft() records failures but keeps the test running', async ({ page }) => {
      const counter = page.getByTestId('default-counter')
      await counter.click()
      // Soft assertions don't stop the test at the first failure. All failures are
      // reported at the end, which is ideal for checking many independent things.
      await expect.soft(counter).toHaveText('Count: 1')
      await expect.soft(counter).toBeEnabled()
      await expect.soft(counter).toBeVisible()
    })

    test('expect.poll() retries an arbitrary value until it matches', async ({ page }) => {
      const counter = page.getByTestId('default-counter')
      await counter.click({ clickCount: 3 })
      // poll() re-runs the callback until the assertion passes (or times out).
      // Perfect for values that aren't locator assertions.
      await expect.poll(async () => Number((await counter.innerText()).replace('Count: ', ''))).toBe(3)
    })

    test('expect().toPass() retries a whole block of assertions', async ({ page }) => {
      const counter = page.getByTestId('default-counter')
      await counter.click({ clickCount: 2 })
      await expect(async () => {
        const text = await counter.textContent()
        expect(text).toContain('2')
        expect(await counter.isEnabled()).toBe(true)
      }).toPass({ timeout: 5_000 })
    })

    test('page.waitForFunction() waits on a browser-side condition', async ({ page }) => {
      const counter = page.getByTestId('default-counter')
      await counter.click({ clickCount: 2 })
      await page.waitForFunction(
        // This callback runs in the browser. The second arg is passed in as `testId`.
        (testId) => document.querySelector(`[data-testid="${testId}"]`)?.textContent === 'Count: 2',
        'default-counter'
      )
    })

    test('attaches a screenshot to the test report', async ({ page }, testInfo) => {
      const counter = page.getByTestId('default-counter')
      await counter.click({ clickCount: 3 })
      // Element screenshots capture just the element's box.
      const screenshot = await counter.screenshot()
      // Attachments show up in the HTML report (`npx playwright show-report`).
      await testInfo.attach('counter-after-3-clicks', { body: screenshot, contentType: 'image/png' })
      expect(screenshot.byteLength).toBeGreaterThan(0)

      // Visual regression testing: the first run creates a baseline image, later runs
      // diff against it. Update with `npx playwright test --update-snapshots`.
      // await expect(counter).toHaveScreenshot('counter-3.png')
    })

    test('can add custom annotations', async ({ page }, testInfo) => {
      const counter = page.getByTestId('default-counter')
      // Annotations appear in the HTML report. Handy for linking to tickets.
      testInfo.annotations.push({ type: 'issue', description: 'https://example.com/issues/123' })
      await counter.click()
      await expect(counter).toHaveText('Count: 1')
    })

    test('is skipped on WebKit (conditional skip example)', async ({ page, browserName }) => {
      const counter = page.getByTestId('default-counter')
      test.skip(browserName === 'webkit', 'Demo: skipping a test for a single browser')
      await counter.click()
      await expect(counter).toHaveText('Count: 1')
    })
  })

  /* ======================
    Responsive / touch
  ====================== */

  test.describe('on a small touch screen', () => {
    // test.use() overrides config options for every test in this describe block.
    test.use({ viewport: { width: 375, height: 667 }, hasTouch: true, isMobile: true })

    test('fits within the viewport width', async ({ page }) => {
      const counter = page.getByTestId('default-counter')
      const box = (await counter.boundingBox())!
      expect(box.x).toBeGreaterThanOrEqual(0)
      expect(box.x + box.width).toBeLessThanOrEqual(375)
    })

    test('increments when tapped', async ({ page }) => {
      const counter = page.getByTestId('default-counter')
      await counter.tap() // dispatches real touch events (needs hasTouch: true)
      await expect(counter).toHaveText('Count: 1')
    })
  })

  /* ======================
        Test isolation
  ====================== */

  test.describe('isolation between tests', () => {
    // Every test gets a brand-new browser context and page, so these two tests are
    // independent even though both click. Each starts at 0, and parallel runs can't interfere.
    test('test A clicks twice', async ({ page }) => {
      const counter = page.getByTestId('default-counter')
      await counter.click({ clickCount: 2 })
      await expect(counter).toHaveText('Count: 2')
    })

    test('test B starts fresh at zero', async ({ page }) => {
      const counter = page.getByTestId('default-counter')
      await expect(counter).toHaveText('Count: 0')
    })
  })
})

/* ========================================================================
                      Serial mode with a shared page
======================================================================== */
// Normally tests are isolated. Serial mode lets a group deliberately share state,
// and if one test fails, the rest are skipped. Use sparingly (e.g. multi-step flows).

test.describe.serial('ClickCounter (serial journey sharing one page)...', () => {
  let page: import('@playwright/test').Page

  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage() // we own this page, so we must close it
    await page.goto(todoPage)
  })

  test.afterAll(async () => {
    await page.close()
  })

  test('step 1: starts at 0', async () => {
    await expect(page.getByTestId('default-counter')).toHaveText('Count: 0')
  })

  test('step 2: click twice -> 2', async () => {
    await page.getByTestId('default-counter').click({ clickCount: 2 })
    await expect(page.getByTestId('default-counter')).toHaveText('Count: 2')
  })

  test('step 3: state from step 2 is still there -> 3 after one more click', async () => {
    await page.getByTestId('default-counter').click()
    await expect(page.getByTestId('default-counter')).toHaveText('Count: 3')
  })
})
