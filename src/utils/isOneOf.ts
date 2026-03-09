// Usage:
// const acceptableValues = ['left', 'center', 'right'] as const
// if (isOneOf(acceptableValues, value)) { setTextAlign(value) }

export function isOneOf<T extends readonly string[]>(arr: T, v: string): v is T[number] {
  return arr.includes(v as any)
}
