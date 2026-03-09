export const getComputedStyleFromCustomProperty = (customProperty: string) => {
  return getComputedStyle(document.documentElement).getPropertyValue(customProperty)
}
