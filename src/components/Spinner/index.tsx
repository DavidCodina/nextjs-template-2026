'use client'

import * as React from 'react'
import { cn } from '@/utils'

type SpinneProps = {
  className?: string
  delay?: number
  size?: string | number
  style?: React.CSSProperties
}

// The color of Spinner is relative to the current color.
// This is written into spinnerPlugin.ts. However, here
// we're defaulting to the primary color.
const baseClasses = `text-primary spinner-border`

/* ========================================================================
                                Spinner
======================================================================== */
// See spinnerPlugin.ts for styles.

// https://disjoint.ca/til/2017/09/21/how-to-delay-the-display-of-loading-animations-in-react/
// https://medium.com/trabe/delayed-render-of-react-components-3482f8ad48ad
// https://www.npmjs.com/package/spin-delay

export const Spinner = ({ className = '', delay = 0, size = 50, style = {} }: SpinneProps) => {
  const [showSpinner, setShowSpinner] = React.useState(false)

  /* ======================
         useEffect()
  ====================== */

  React.useLayoutEffect(() => {
    let timeout: NodeJS.Timeout

    if (delay === 0) {
      setShowSpinner(true)
    } else if (delay > 0) {
      timeout = setTimeout(() => {
        setShowSpinner(true)
      }, delay)
    }

    return () => {
      clearTimeout(timeout)
      setShowSpinner(false)
    }
  }, [delay])

  /* ======================
        renderSpinner()
  ====================== */

  const renderSpinner = () => {
    if (showSpinner) {
      return (
        <div className={cn(baseClasses, className)} role='status' style={{ width: size, height: size, ...style }}>
          <span className='sr-only'>Loading...</span>
        </div>
      )
    }

    return null
  }

  /* ======================
          return
  ====================== */

  return renderSpinner()
}
