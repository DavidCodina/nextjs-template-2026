/* ========================================================================

======================================================================== */
///////////////////////////////////////////////////////////////////////////
//
// Type: (...args: any[]) => Awaitable<void>
//
// This assertion checks if a function was called at least once with certain parameters.
// Requires a spy function to be passed to expect.
//
///////////////////////////////////////////////////////////////////////////

describe('toHaveBeenCalledWith...', () => {
  const utils = {
    add: (n1: number, n2: number) => {
      return n1 + n2
    }
  }

  it(`should have been called with 1,2.`, () => {
    // ❌  const addSpy = vi.spyOn(utils, 'add')
    const addSpy = jest.spyOn(utils, 'add')
    utils.add(1, 2)

    expect(addSpy).toHaveBeenCalledWith(1, 2)
  })
})
