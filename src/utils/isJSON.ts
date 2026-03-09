/* ======================
    
====================== */

export const isJSON = (value: unknown): boolean => {
  try {
    JSON.parse(value as string)
    return true
  } catch {
    return false
  }
}
