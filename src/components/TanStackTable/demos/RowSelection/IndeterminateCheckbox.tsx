import { useEffect, useRef } from 'react'
import { Check, Minus } from 'lucide-react'

import type { TableVariant } from './types'

import { cn } from '@/utils'

type IndeterminateCheckboxProps = React.ComponentProps<'input'> & {
  indeterminate?: boolean
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
                            IndeterminateCheckbox
======================================================================== */
///////////////////////////////////////////////////////////////////////////

export const IndeterminateCheckbox = ({
  checked,
  className = '',
  disabled = false,
  indeterminate,
  onChange,
  style = {},
  title,
  variant = 'primary',
  ...otherProps
}: IndeterminateCheckboxProps) => {
  ///////////////////////////////////////////////////////////////////////////
  //
  // null! is a hack to avoid having to make a conditional check within useEffect().
  //
  //   const internalInputRef = useRef<HTMLInputElement>(null!)
  //
  // Cool trick from Tanstack Table example, but I prefer to simply add
  // the `&& internalInputRef.current` check in the useEffect if condition.
  //
  ///////////////////////////////////////////////////////////////////////////

  const internalInputRef = useRef<HTMLInputElement>(null)

  /* ======================
        useEffect()
  ====================== */

  useEffect(() => {
    if (typeof indeterminate === 'boolean' && internalInputRef.current) {
      internalInputRef.current.indeterminate = !checked && indeterminate
    }
  }, [indeterminate, checked])

  /* ======================
          renderIcon()
  ====================== */

  const renderIcon = () => {
    if (!checked && !indeterminate) return null

    if (checked) {
      return (
        <Check
          className={cn(
            'bg-primary size-full',
            !disabled && variant === 'primary' && 'bg-primary',
            !disabled && variant === 'secondary' && 'bg-secondary',
            disabled && 'bg-(--table-disabled-color)'
          )}
          strokeWidth={2.5}
        />
      )
    }

    // Otherwise return indeterminate UI.
    return (
      <Minus
        className={cn(
          'bg-primary size-full',
          !disabled && variant === 'primary' && 'bg-primary',
          !disabled && variant === 'secondary' && 'bg-secondary',
          disabled && 'bg-(--table-disabled-color)'
        )}
        strokeWidth={2.5}
      />
    )
  }

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
        aria-checked={checked ? true : indeterminate ? 'mixed' : false}
        aria-disabled={disabled}
        aria-label={otherProps['aria-label']}
        aria-labelledby={otherProps['aria-labelledby']}
        role='checkbox'
        className={cn(
          baseClasses,
          className,
          !disabled && (checked || indeterminate) && variant === 'primary' && 'border-primary',
          !disabled && (checked || indeterminate) && variant === 'secondary' && 'border-secondary',
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
        {renderIcon()}
      </div>
    </>
  )
}

/* ========================================================================
                                Deprecated
======================================================================== */
// The current IndeterminateCheckbox is more sophisticated in that it implements
// a custom checkbox icon in conjunction with a hidden input. This allows us
// to ALWAYS render white checks, rather than being subject to the browser's algorithm.
// Because indeterminate checkboxes are inherently uncommon and cryptic, I've included
// the original implementation for the basic version here.

/*
export const Deprecated_IndeterminateCheckbox = ({
  checked,
  className = '',
  indeterminate,
  style = {},
  variant: _variant,
  ...otherProps
}: IndeterminateCheckboxProps) => {
  const internalInputRef = useRef<HTMLInputElement>(null!)

  useEffect(() => {
    if (typeof indeterminate === 'boolean') { internalInputRef.current.indeterminate = !checked && indeterminate }
  }, [indeterminate, checked])

  return (
    <input
      checked={checked}
      className={className}
      ref={internalInputRef}
      style={style}
      type='checkbox'
      {...otherProps}
    />
  )
}
*/
