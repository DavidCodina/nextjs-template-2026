'use client'

import type { DropzoneErrorProps } from './types'
import { cn } from '@/utils'

type InternalDropzoneErrorProps = {
  disabled: boolean
  error: string
  touched: boolean
}

const baseClasses = `
block text-destructive mt-1 text-sm w-full overflow-scroll
`

/* ========================================================================

======================================================================== */

export const DropzoneError = ({
  children,
  className = '',
  disabled = false,
  error = '',
  touched = false,
  ...otherProps
}: DropzoneErrorProps & InternalDropzoneErrorProps) => {
  /* ======================
          constants 
  ====================== */

  // Needs to match DropzoneBase.tsx
  const _isInvalid = !!error
  const _isValid = !error && touched

  /* ======================
          return
  ====================== */

  if (!children || disabled) {
    return null
  }
  return (
    <div
      {...otherProps}
      className={cn(
        baseClasses,
        className,
        // isInvalid && 'text-destructive',
        // isValid && '',
        disabled && 'hidden text-neutral-400'
      )}
    >
      {children}
    </div>
  )
}
