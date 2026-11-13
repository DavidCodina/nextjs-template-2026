import * as React from 'react'
import { Check } from 'lucide-react'

import type { TableVariant } from './types'

import { cn } from '@/utils'

type TableCheckboxProps = React.ComponentProps<'input'> & {
  variant?: TableVariant
}

const FIELD_BOX_SHADOW_MIXIN = `shadow-xs`

const FIELD_FOCUS_MIXIN = `
focus-visible:shadow-none
focus-visible:border-(--table-border-color)
focus-visible:ring-[3px]
focus-visible:ring-(--table-border-color)/40
`

const baseClasses = `
inline-block
bg-card size-5 text-white
border rounded overflow-hidden outline-none cursor-pointer
${FIELD_BOX_SHADOW_MIXIN}
${FIELD_FOCUS_MIXIN}
`

/* ========================================================================

======================================================================== */

export const Checkbox = ({
  checked,
  className = '',
  disabled = false,
  onChange,
  style = {},
  title,
  variant = 'primary',
  ...otherProps
}: TableCheckboxProps) => {
  const internalInputRef = React.useRef<HTMLInputElement>(null)

  /* ======================
          return
  ====================== */

  return (
    <>
      <input
        // ⚠️ Gotcha! Do not set type="hidden". In order for Tanstack Table to work,
        // it must be type="checkbox". Thus if you want something like a hidden
        // checkbox, you should use className="hidden"
        type='checkbox'
        {...otherProps} // i.e., aria-label, etc.
        aria-hidden='true'
        aria-label={undefined}
        aria-labelledby={undefined}
        tabIndex={-1}
        checked={checked}
        className='hidden'
        disabled={disabled}
        onChange={(e) => {
          if (disabled) return // Technically redundant.
          // Tanstack Table passes this:
          // (e) => { column.toggleVisibility == null || column.toggleVisibility(e.target.checked); }
          onChange?.(e)
        }}
        ref={internalInputRef}
      />

      <div
        aria-checked={checked}
        aria-disabled={disabled}
        aria-label={otherProps['aria-label']}
        aria-labelledby={otherProps['aria-labelledby']}
        role='checkbox'
        className={cn(
          baseClasses,
          className,
          !disabled && checked && variant === 'primary' && 'border-primary',
          !disabled && checked && variant === 'secondary' && 'border-secondary',
          disabled && 'pointer-events-none border-(--table-disabled-color) opacity-65'
        )}
        onClick={() => {
          if (disabled === true) return
          internalInputRef.current?.click()
        }}
        onKeyDown={(e) => {
          if (disabled) return
          if (e.key === ' ') {
            e.preventDefault() // Prevents page scroll on Space
            internalInputRef.current?.click()
          }
        }}
        style={style}
        tabIndex={disabled ? -1 : 0}
        title={title}
      >
        {checked && (
          <Check
            className={cn(
              'bg-primary size-full',
              !disabled && checked && variant === 'primary' && 'bg-primary',
              !disabled && checked && variant === 'secondary' && 'bg-secondary',
              disabled && 'bg-(--table-disabled-color)'
            )}
            strokeWidth={2.5}
          />
        )}
      </div>
    </>
  )
}
