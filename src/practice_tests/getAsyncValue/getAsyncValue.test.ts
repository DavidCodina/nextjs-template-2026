import { getAsyncValue } from './index'

describe(`getAsyncValue()...`, () => {
  it(`should NOT be typeof 'number'.`, async () => {
    const result = await getAsyncValue('abc123')
    expect(typeof result).not.toBe('number')
  })

  it(`should be typeof 'string'.`, async () => {
    const result = await getAsyncValue('abc123')
    expect(typeof result).toBe('string')
  })

  // As an alternative to using async/await you can use resolves.
  // https://vitest.dev/api/expect#resolves
  // https://vitest.dev/api/expect#rejects
  it(`should be typeof 'string' (resolves example).`, async () => {
    const value = 'abc123'
    const result = getAsyncValue(value)

    await expect(result).resolves.toEqual(expect.any(String))
    await expect(result).resolves.toBe(value)
  })
})
