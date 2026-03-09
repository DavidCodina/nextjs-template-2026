/* ========================================================================

======================================================================== */

describe('toBeOneOf...', () => {
  const fruit = 'apple'
  test('fruit is one of the allowed values', () => {
    // Jest does not support .toBeOneOf().
    // ❌ expect(fruit).toBeOneOf(['apple', 'banana', 'orange'])
    expect(['apple', 'banana', 'orange'].includes(fruit)).toBe(true)
  })

  test('fruit is one of the array values', () => {
    expect(['abc123', undefined].includes(undefined)).toBe(true)
  })

  // The asymmetric matcher is particularly useful when testing optional
  // properties that could be either null or undefined:
  test('optional properties can be null or undefined', () => {
    const user = {
      firstName: 'John',
      middleName: undefined,
      lastName: 'Doe'
    }

    // ❌ expect(user.firstName).toBeTypeOf('string')
    expect(typeof user.firstName).toBe('string')

    // ❌ expect(user.middleName).toBeOneOf([expect.any(String), undefined])
    expect([expect.any(String), undefined]).toContain(user.middleName)

    // ❌ expect(user.lastName).toBeTypeOf('string')
    expect(typeof user.lastName).toBe('string')
  })
})
