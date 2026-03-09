/* ========================================================================

======================================================================== */

describe('toBeTypeOf...', () => {
  test("should be type of 'string'", () => {
    const received = 'Whuddup!'
    const expected = 'string'

    // Jest does not support .toBeTypeOf().
    // ❌ expect(received).toBeTypeOf(expected)
    expect(typeof received).toBe(expected)

    // ❌ expect(received).not.toBeTypeOf('number')
    expect(typeof received).not.toBe('number')
  })
})
