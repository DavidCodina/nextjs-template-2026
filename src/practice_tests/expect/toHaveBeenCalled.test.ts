/* ========================================================================

======================================================================== */
///////////////////////////////////////////////////////////////////////////
//
// Type: () => Awaitable<void>
//
// This assertion is useful for testing that a function has been called.
// Requires a spy function to be passed to expect.
//
///////////////////////////////////////////////////////////////////////////

describe('toHaveBeenCalled...', () => {
  it(`should...`, () => {
    const utils = {
      add: (n1: number, n2: number) => {
        return n1 + n2
      }
    }

    // ❌ const addSpy = vi.spyOn(utils, 'add')
    const addSpy = jest.spyOn(utils, 'add')

    expect(addSpy).not.toHaveBeenCalled()

    utils.add(2, 3)

    expect(addSpy).toHaveBeenCalled()
    expect(addSpy).not.toHaveBeenCalledTimes(2)
  })

  // The docs say you need a spy, but that's not technically correct.
  // You can also use vi.fn(). Actually, I think they're using the term "spy" here loosely.
  describe('fireCallback()...', () => {
    type Callback = (str: string) => string

    const fireCallback = (str: string, callback: Callback) => {
      return callback?.(str)
    }

    // ❌ const mockCallback = vi.fn()
    const mockCallback = jest.fn()

    it('should execute mockCallback() once.', () => {
      fireCallback('abc123', mockCallback)

      expect(mockCallback).toHaveBeenCalled()
      expect(mockCallback).not.toHaveBeenCalledTimes(2)
    })

    it('should have executed mockCallback() twice.', () => {
      fireCallback('abc123', mockCallback)
      fireCallback('abc123', mockCallback)

      expect(mockCallback).toHaveBeenCalled()
      expect(mockCallback).toHaveBeenCalledTimes(2)
    })
  })
})
