import { render, screen } from '@testing-library/react'

/* ========================================================================

======================================================================== */
///////////////////////////////////////////////////////////////////////////
//
// Type: (received: string) => Awaitable<void>
//
// toContain asserts if the actual value is in an array. toContain can also check whether
// a string is a substring of another string.
//
///////////////////////////////////////////////////////////////////////////

describe('toContain...', () => {
  it(`should contain "Muffy".`, () => {
    const received = ['Muffy', 'Gingerbread', 'Punkin']
    const expected = 'Muffy'

    expect(received).toContain(expected)
    expect(received).not.toContain('Fluffy')
  })

  // toContain can also check whether a string is a substring of another string.
  it(`should contain "Man".`, () => {
    const result = 'DaveMan'
    const expected = 'Man'

    expect(result).toContain(expected)
    expect(result).not.toContain('man')
  })

  // Since Vitest 1.0, if you are running tests in a browser-like environment,
  // .toContain() can  also check if  an element is inside another one.
  it('should have class & is inside other element', () => {
    render(
      <section data-testid='my-section'>
        <div data-testid='my-div' className='flex'>
          abc123
        </div>
      </section>
    )

    const section = screen.getByTestId('my-section')
    const element = screen.getByTestId('my-div')

    // Jest's .toContain() does not check if an element is inside another one
    // It only works for arrays and strings.
    // ❌ expect(section).toContain(element)
    expect(section.contains(element)).toBe(true)
  })

  // Since Vitest 1.0, if you are running tests in a browser-like environment,
  // .toContain() can also check if class is contained in a classList,
  it('The element should have class', () => {
    render(
      <div data-testid='my-div' className='flex'>
        abc123
      </div>
    )

    const element = screen.getByTestId('my-div')

    // Unfortunately, this won't work in Jest.
    // ❌ expect(element.classList).toContain('flex') // eslint-disable-line
    // ✅ expect(element.classList.contains('flex')).toBe(true) // eslint-disable-line
    expect(element).toHaveClass('flex')
  })
})
