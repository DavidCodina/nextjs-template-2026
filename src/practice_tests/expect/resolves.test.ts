/* ========================================================================

======================================================================== */
///////////////////////////////////////////////////////////////////////////
//
// Type: Promisify<Assertions>
//
// resolves is intended to remove boilerplate when asserting asynchronous code.
// Use it to unwrap value from the pending promise and assert its value with usual assertions.
// If the promise rejects, the assertion will fail.
//
// It returns the same Assertions object, but all matchers now return Promise, so you would need tcleao await it.
// Also works with chai assertions.
//
///////////////////////////////////////////////////////////////////////////

describe('resolves...', () => {
  const getAsyncValue = async (value: any) => {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    return Promise.resolve(value)
  }
  // The first two examples demonstrates that we don't necessarily
  // need to use .resolves. Instead, we can await the result.
  it(`should NOT be typeof 'number'.`, async () => {
    const result = await getAsyncValue('abc123')
    // ❌ expect(result).not.toBeTypeOf('number')
    expect(typeof result).not.toBe('number')
  })

  it(`should be typeof 'string'.`, async () => {
    const result = await getAsyncValue('abc123')
    // ❌ expect(result).toBeTypeOf('string')
    expect(typeof result).toBe('string')
  })

  it(`should be typeof 'string' (resolves example).`, async () => {
    const value = 'abc123'
    const result = getAsyncValue(value)
    // ❌ expect(result).resolves.toBeTypeOf('string')
    // ❌ await expect(typeof result).resolves.toBe('string')
    await expect(result).resolves.toEqual(expect.any(String))

    await expect(result).resolves.toBe(value)
  })
})
