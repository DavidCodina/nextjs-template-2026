'use client'

import * as React from 'react'
import { InputBase } from './InputBase'
import { Label } from '../Label'
import { FormHelp } from '../FormHelp'
import { FormError } from '../FormError'
import { cn } from '@/utils'

import type { LabelProps } from '../Label'
import type { FormHelpProps } from '../FormHelp'
import type { FormErrorProps } from '../FormError'

type DataAttributes = {
  [key: `data-${string}`]: string | number | boolean | undefined
}

type GroupProps = React.ComponentProps<'div'>

type InputProps = {
  disabled?: boolean
  touched?: boolean
  error?: string
  id?: string

  groupProps?: GroupProps & DataAttributes

  labelProps?: LabelProps & DataAttributes
  inputProps?: React.ComponentProps<typeof InputBase> & DataAttributes
  errorProps?: FormErrorProps & DataAttributes
  helpProps?: FormHelpProps & DataAttributes

  renderInputBaseOnly?: boolean
  renderInputBase?: (inputBase: React.JSX.Element) => React.JSX.Element
}

/* ========================================================================

======================================================================== */

export const Input = ({
  disabled, // Do not set default
  error, // Do not set default
  id, // Do not set default
  touched, // Do not set default

  groupProps = {},
  labelProps = {},
  inputProps = {},
  helpProps = {},
  errorProps = {},

  renderInputBaseOnly = false,
  renderInputBase,
  // You'd think you don't need this, but there's one reason why you do.
  // When Radix uses asChild in a Popover or other components, it clones
  // the child and adds ref, onClick, aria-haspopup, aria-expanded,
  // aria-controls, data-state and type="button". Without ...otherProps it
  // won't work.
  ...otherProps
}: InputProps) => {
  const uid = React.useId()

  disabled =
    typeof disabled === 'boolean' ? disabled : typeof inputProps.disabled === 'boolean' ? inputProps.disabled : false

  error =
    error && typeof error === 'string'
      ? error
      : inputProps.error && typeof inputProps.error === 'string'
        ? inputProps.error
        : errorProps.children && typeof errorProps.children === 'string'
          ? errorProps.children
          : ''

  id = id && typeof id === 'string' ? id : inputProps.id && typeof inputProps.id === 'string' ? inputProps.id : uid

  touched =
    typeof touched === 'boolean' ? touched : typeof inputProps.touched === 'boolean' ? inputProps.touched : false

  /* ======================
      InputBaseComponent
  ====================== */

  const InputBaseComponent = (
    <InputBase
      {...inputProps}
      {...(renderInputBaseOnly === true ? otherProps : {})}

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
        className={cn('mb-1', labelProps.className)}
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

  if (renderInputBaseOnly) {
    return InputBaseComponent
  }

  return (
    <div {...groupProps} {...otherProps}>
      {renderLabel()}

      {typeof renderInputBase === 'function' ? renderInputBase(InputBaseComponent) : InputBaseComponent}

      <FormHelp {...helpProps} disabled={disabled} />

      <FormError {...errorProps} disabled={disabled} touched={touched}>
        {error}
      </FormError>
    </div>
  )
}
