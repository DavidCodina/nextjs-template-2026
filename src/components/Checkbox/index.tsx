'use client'

import * as React from 'react'
import { CheckboxBase } from './CheckboxBase'
import { Label } from '../label'
import { FormHelp } from '../FormHelp'
import { FormError } from '../FormError'
import { cn } from '@/utils'

import type { LabelProps } from '../label'
import type { FormHelpProps } from '../FormHelp'
import type { FormErrorProps } from '../FormError'
import type { CheckboxBaseProps } from './CheckboxBase'

type DataAttributes = {
  [key: `data-${string}`]: string | number | boolean | undefined
}

type GroupProps = React.ComponentProps<'div'>

type CheckboxProps = {
  disabled?: boolean
  touched?: boolean
  error?: string
  id?: string

  groupProps?: GroupProps & DataAttributes
  labelProps?: LabelProps & DataAttributes
  checkProps?: CheckboxBaseProps & DataAttributes
  errorProps?: FormErrorProps & DataAttributes
  helpProps?: FormHelpProps & DataAttributes
  /** Used internally by CheckboxGroup */
  _hideError?: boolean
  renderCheckboxBaseOnly?: boolean
}

// const val: string | number | readonly string[] | undefined
const TEST = {} as React.ComponentProps<typeof CheckboxBase>
export const val = TEST.value

export { type CheckedState } from '@radix-ui/react-checkbox'

/* ========================================================================

======================================================================== */

export const Checkbox = ({
  disabled, // Do not set default
  error, // Do not set default
  id, // Do not set default
  touched, // Do not set default
  _hideError = false,

  groupProps = {},
  labelProps = {},
  checkProps = {},
  helpProps = {},
  errorProps = {},

  renderCheckboxBaseOnly = false,

  // You'd think you don't need this, but there's one reason why you do.
  // When Radix uses asChild in a Popover or other components, it clones
  // the child and adds ref, onClick, aria-haspopup, aria-expanded,
  // aria-controls, data-state and type="button". Without ...otherProps it
  // won't work.
  ...otherProps
}: CheckboxProps) => {
  const uid = React.useId()

  disabled =
    typeof disabled === 'boolean' ? disabled : typeof checkProps.disabled === 'boolean' ? checkProps.disabled : false

  error =
    error && typeof error === 'string'
      ? error
      : checkProps.error && typeof checkProps.error === 'string'
        ? checkProps.error
        : errorProps.children && typeof errorProps.children === 'string'
          ? errorProps.children
          : ''

  id = id && typeof id === 'string' ? id : checkProps.id && typeof checkProps.id === 'string' ? checkProps.id : uid

  touched =
    typeof touched === 'boolean' ? touched : typeof checkProps.touched === 'boolean' ? checkProps.touched : false

  /* ======================
    CheckboxBaseComponent
  ====================== */

  const CheckboxBaseComponent = (
    <CheckboxBase
      {...checkProps}
      {...(renderCheckboxBaseOnly === true ? otherProps : {})}

      id={id}
      disabled={disabled}
      error={error}
      touched={touched}
    />
  )

  /* ======================
        renderLabel()
  ====================== */

  const renderLabel = () => {
    if (!labelProps.children) {
      return null
    }

    return (
      <Label
        {...labelProps}
        className={cn('text-xs', labelProps.className)}
        disabled={disabled}
        error={error}
        htmlFor={id}
        touched={touched}
      >
        {labelProps.children}
      </Label>
    )
  }

  /* ======================
          return
  ====================== */

  if (renderCheckboxBaseOnly) {
    return CheckboxBaseComponent
  }

  return (
    <div {...groupProps} {...otherProps}>
      <div className='flex items-center gap-2'>
        {CheckboxBaseComponent}
        {renderLabel()}
      </div>

      <FormHelp {...helpProps} disabled={disabled} />

      {!_hideError && (
        <FormError {...errorProps} disabled={disabled} touched={touched}>
          {error}
        </FormError>
      )}
    </div>
  )
}
