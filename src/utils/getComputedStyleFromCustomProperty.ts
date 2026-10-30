/* ========================================================================

======================================================================== */
// Note: this will only work against properties defined in :root. In other words,
// it will work for --color-green-500, but not --color-foreground. Morever, it's
// not responsive to theme changes. As such, it's not very practical.
// A better solution is something like useCCSSFromTailwind() in the hooks directory.

export const getComputedStyleFromCustomProperty = (customProperty: string) => {
  // This is especiially important for Tanstack Start.
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return
  }

  return getComputedStyle(document.documentElement).getPropertyValue(customProperty)
}
