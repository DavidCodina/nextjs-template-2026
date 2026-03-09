'use client'

import { cn } from '@/utils'

type Paragraph1Props = {
  disabled: boolean
  error: string
  files: File[] | null
  isDragActive: boolean

  touched: boolean
}

const baseClasses = `
mb-1 text-lg font-bold
select-none
`

const spanClasses = `
text-(--dropzone-theme-color,var(--dropzone-default-theme-color))
`

/* ========================================================================

======================================================================== */
// Paragraph1 is the main paragraph underneath the upload <svg>.
// It will render in one of three ways depending on whether or not
// there are files and/or isDragActive.

export const Paragraph1 = ({
  disabled = false,
  error = '',
  isDragActive = false,
  files,
  touched = false
}: Paragraph1Props) => {
  /* ======================
          constants 
  ====================== */

  // Needs to match DropzoneBase.tsx
  const isInvalid = !!error
  const isValid = !error && touched

  /* ======================

  ====================== */

  const paragraphClasses = cn(
    baseClasses,
    isInvalid && 'text-destructive',
    isValid && 'text-success',
    isDragActive && 'text-success',
    disabled && 'text-neutral-400'
  )

  /* ======================
          return
  ====================== */

  if (isDragActive) {
    return <p className={paragraphClasses}>Drop it like it's hot!</p>
  }

  if (files && Array.isArray(files) && files.length > 0) {
    return <p className={paragraphClasses}>Selected files:</p>
  }
  return (
    <p className={paragraphClasses}>
      Drop your files here, or{' '}
      <span
        className={cn(
          spanClasses,
          isInvalid && 'text-destructive',
          isValid && 'text-success',
          disabled && 'text-neutral-400'
        )}
      >
        browse
      </span>
    </p>
  )
}
