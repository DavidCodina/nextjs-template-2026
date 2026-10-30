import type { ResBody } from '@/types'

/* ======================

====================== */

const isStringDict = (value: unknown): value is Record<string, string> => {
  const isObject = typeof value === 'object' && value !== null
  if (!isObject) {
    return false
  }

  return Object.values(value).every((v) => typeof v === 'string')
}

/* ========================================================================

======================================================================== */
// ⚠️ Updated in 12/2025 to require `code` property.

export const isResBody = <T>(value: unknown): value is ResBody<T> => {
  const isObject = typeof value === 'object' && value !== null
  if (!isObject) {
    return false
  }

  const isCode = 'code' in value && typeof value.code === 'string'
  const isData = 'data' in value
  const isMessage = 'message' in value && typeof value.message === 'string'
  const isSuccess = 'success' in value && typeof value.success === 'boolean'

  const isErrorsOrUndefined = (() => {
    if (!('errors' in value)) {
      return true
    }

    return isStringDict(value.errors)
  })()

  return isCode && isData && isMessage && isSuccess && isErrorsOrUndefined
}
