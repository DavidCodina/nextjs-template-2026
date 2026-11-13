export function isStringArray(arg: any): arg is string[] {
  if (!Array.isArray(arg)) {
    return false
  }
  return arg.every((item: any) => typeof item === 'string')
}

/* ======================

====================== */

export function isBooleanObject(arg: any): arg is Record<string, boolean> {
  if (typeof arg !== 'object' || arg === null) {
    return false
  }

  for (const key in arg) {
    if (!arg.hasOwnProperty(key)) {
      continue // Skip inherited properties
    }

    const value = arg[key]
    if (typeof value !== 'boolean') {
      return false
    }
  }

  return true
}
