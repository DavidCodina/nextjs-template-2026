'use client'

import { Fragment } from 'react'
import { cn } from '@/utils'

type Paragraph2Props = {
  acceptMessage?: string
  deleteFileByName: (fileName: string) => void
  disabled: boolean
  files: File[] | null
  fileNames: string[] | null
  isDragActive: boolean
}

const baseClasses = `
pt-2
text-sm text-muted-foreground
select-none
`

const deleteButtonClasses = `
text-foreground font-mono cursor-pointer
hover:text-destructive
`

/* ========================================================================

======================================================================== */
// Paragraph2 will initially render with the acceptMessage prop.
// However, if there are files then for each file a button will
// be created that is used for deleting the file.

export const Paragraph2 = ({
  acceptMessage,
  disabled = false,
  deleteFileByName,
  files,
  fileNames,
  isDragActive = false
}: Paragraph2Props) => {
  const paragraphClasses = cn(baseClasses, isDragActive && 'text-success', disabled && 'text-neutral-400')

  /* ======================
          return
  ====================== */

  if (files && Array.isArray(fileNames) && fileNames.length > 0) {
    return (
      <p className={paragraphClasses}>
        {fileNames.map((name, index) => (
          <Fragment key={index}>
            <button
              className={cn(
                deleteButtonClasses,
                isDragActive && 'text-success',
                disabled && 'pointer-events-none text-neutral-400'
              )}
              onClick={(e) => {
                e.stopPropagation()
                deleteFileByName(name)
              }}
              type='button'
              title='Delete Image'
            >
              {name}
            </button>
            {index !== fileNames.length - 1 ? ', ' : ''}
          </Fragment>
        ))}
      </p>
    )
  }

  if (!acceptMessage) return null

  return <p className={paragraphClasses}>{acceptMessage}</p>
}
