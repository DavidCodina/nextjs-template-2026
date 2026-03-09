import { useEffect, useState } from 'react'

// With useDocumentVisibility it toggles between 'visible' and 'hidden'.
// However, it's dependent only on the window's tab being current.
// In other words, the window losing focus does not affect this at all.
// In contrast, this is true only when the tab is current AND the window has focus.
// If you switch tabs and/or switch windows it goes to false.
// Thus this covers more use cases.
// ⚠️ Gotcha: Will not work when Chrome Devtools are open.
export const useWindowFocus = () => {
  const [focused, setFocused] = useState(true)

  useEffect(() => {
    const focusListener = () => setFocused(true)
    const blurListener = () => setFocused(false)

    window.addEventListener('focus', focusListener)
    window.addEventListener('blur', blurListener)

    return () => {
      window.removeEventListener('focus', focusListener)
      window.removeEventListener('blur', blurListener)
    }
  }, [])

  return focused
}
