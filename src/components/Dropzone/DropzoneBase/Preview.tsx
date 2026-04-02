'use client'

import type { PreviewObject } from '../types'
import { cn } from '@/utils'

type PreviewProps = {
  deleteFileByName: (fileName: string) => void
  disabled: boolean
  preview: PreviewObject
}

// size-full so that it expands to the full width/height of the grid item dimensions.
const baseClasses = `
relative size-full
`

const imageClasses = `
h-full w-full object-contain 
bg-neutral-700
border border-neutral-950 rounded-lg
select-none
`

const nonImageClasses = `
h-full w-full p-2
text-white text-[10px] font-semibold break-all
bg-neutral-700
border border-neutral-950 rounded-lg
`

const previewDeleteButtonClasses = `
absolute -top-2 -right-2
flex items-center justify-center size-6
text-white text-xl cursor-pointer
bg-(--dropzone-theme-color,var(--dropzone-default-theme-color))
border border-white rounded-full
shadow-[0px_1px_2px_rgba(0,0,0,0.25)]
hover:bg-destructive
`

/* ========================================================================

======================================================================== */

export const Preview = ({ deleteFileByName, disabled = false, preview }: PreviewProps) => {
  /* ======================
    renderDeleteButton()
  ====================== */

  const renderDeleteButton = () => {
    return (
      <button
        className={cn(previewDeleteButtonClasses, disabled && 'pointer-events-none bg-neutral-400')}
        disabled={disabled}
        onClick={(e) => {
          if (disabled) {
            return
          }
          e.stopPropagation()
          deleteFileByName(preview.name)
        }}
        title='Remove Image'
        type='button'
      >
        <svg width='1em' height='1em' fill='currentColor' viewBox='0 0 16 16'>
          <path d='M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708' />
        </svg>
      </button>
    )
  }

  /* ======================
          return
  ====================== */

  return (
    <div className={baseClasses}>
      {preview.readerResult.substring(5, 10) === 'image' ? (
        <img className={cn(imageClasses, disabled && 'grayscale-100')} src={preview.readerResult} alt={preview.name} />
      ) : (
        <div className={nonImageClasses}>{preview.name}</div>
      )}

      {renderDeleteButton()}
    </div>
  )
}
