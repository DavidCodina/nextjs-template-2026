import * as React from 'react'

/* ======================

====================== */
///////////////////////////////////////////////////////////////////////////
//
// Usage:  const [autoResetPageIndex, skipAutoResetPageIndex] = useSkipResetPageIndex()
// Then in table options add this property:
//
//   - autoResetPageIndex: autoResetPageIndex
//
// Then in meta.updateData add this:
//
//   - skipAutoResetPageIndex()
//
//
//
///////////////////////////////////////////////////////////////////////////

/**
 * Skips the automatic page-index reset that TanStack triggers when the data
 * array changes. Without this, editing a cell on page 3 would bounce you back
 * to page 1 on every keystroke-commit.
 */
export const useSkipResetPageIndex = () => {
  // Render-safe: the flag lives in state, so reading it during render is fine
  // in React 19 (no `ref.current` access during render).
  const [shouldSkip, setShouldSkip] = React.useState(true)

  // Called right before a data change to suppress the next page-index reset.
  const skip = React.useCallback(() => {
    setShouldSkip(false)
  }, [])

  // After the suppressed render commits, flip the flag back on so normal
  // resets (sorting, filtering, etc.) keep working.
  React.useEffect(() => {
    if (!shouldSkip) {
      setShouldSkip(true)
    }
  }, [shouldSkip])

  return [shouldSkip, skip] as const
}
