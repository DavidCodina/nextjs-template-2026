'use client'

import type { DropzoneLabelProps, InternalRef } from './types'
import { cn } from '@/utils'

const baseClasses = `
group
flex items-center 
leading-none select-none
w-fit cursor-pointer
mb-1 text-sm font-medium
`

type InternalDropzoneLabelProps = {
  disabled: boolean
  error: string
  internalRef: InternalRef
  touched: boolean
}

/* ========================================================================

======================================================================== */

export const DropzoneLabel = ({
  children,
  disabled = false,
  error = '',
  htmlFor,
  className = '',
  labelRequired = false,
  internalRef,
  touched = false,
  ...otherProps
}: DropzoneLabelProps & InternalDropzoneLabelProps) => {
  /* ======================
          constants 
  ====================== */

  // Needs to match DropzoneBase.tsx
  const isInvalid = !!error
  const isValid = !error && touched

  /* ======================
          return
  ====================== */

  if (!children) {
    return null
  }

  return (
    <label
      {...otherProps}
      htmlFor={htmlFor}
      className={cn(
        baseClasses,
        className,
        isInvalid && 'text-destructive',
        isValid && 'text-success',
        disabled && 'text-muted-foreground opacity-65' // ???
      )}
      ///////////////////////////////////////////////////////////////////////////
      //
      // The label's htmlFor is correctly wired up to the inputId, such that the file dialog will open
      // when the label is clicked. However, this seems to bypass giving focus to the input first,
      // prior to opening the fil dialog. Essentially, it bypasses some mechanism that is
      // important to work in conjunction with the File System Access API that's triggered by the
      // onFileDialogCancel() callback. Consequently, a more robust approach entails programmatically
      // clicking the DropzoneBase's <div> element from within the DropzoneLabel.
      //
      ///////////////////////////////////////////////////////////////////////////
      onClick={() => {
        if (!internalRef.current) return
        internalRef.current.click()
      }}
    >
      {children}
      {labelRequired && (
        <sup
          className={cn(
            'text-destructive relative -top-0.5 text-[1.25em]',
            isInvalid && 'text-destructive',
            isValid && 'text-success',
            disabled && 'text-inherit'
            // 'not-group-data-validating/root:group-data-valid:not-group-data-disabled:text-success',
            // 'group-data-disabled:text-inherit'
          )}
        >
          *
        </sup>
      )}
    </label>
  )
}
