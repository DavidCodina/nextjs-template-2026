/* ======================
      isFileArray()
====================== */

export const isFileArray = (value: any): value is File[] => {
  return Array.isArray(value) && value.every((item) => item instanceof File)
}
