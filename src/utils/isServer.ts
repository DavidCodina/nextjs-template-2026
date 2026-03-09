/* ======================
        isServer()
====================== */

export const isServer = () => {
  if (typeof window === 'undefined') {
    return true
  }
  return false
}
