'use client'

import * as React from 'react'
import { Label } from '@/components/label'
import { FormHelp } from '@/components/FormHelp'
import { FormError } from '@/components/FormError'
import { cn } from '@/utils'

import { SelectBase } from './SelectBase'
export { type SelectOption } from './types'

import type { LabelProps } from '../label'
import type { FormHelpProps } from '../FormHelp'
import type { FormErrorProps } from '../FormError'

type DataAttributes = {
  [key: `data-${string}`]: string | number | boolean | undefined
}

type GroupProps = React.ComponentProps<'div'>

type SelectProps = {
  disabled?: boolean
  touched?: boolean
  error?: string
  id?: string

  groupProps?: GroupProps & DataAttributes
  labelProps?: LabelProps & DataAttributes
  selectProps?: React.ComponentProps<typeof SelectBase> & DataAttributes
  errorProps?: FormErrorProps & DataAttributes
  helpProps?: FormHelpProps & DataAttributes

  renderSelectBaseOnly?: boolean
  renderSelectBase?: (selectBase: React.JSX.Element) => React.JSX.Element
}

/* ========================================================================

======================================================================== */

export const CustomSelect = ({
  disabled, // Do not set default
  error, // Do not set default
  id, // Do not set default
  touched, // Do not set default

  groupProps = {},
  labelProps = {},
  selectProps = {},
  helpProps = {},
  errorProps = {},

  renderSelectBaseOnly = false,
  renderSelectBase,

  // You'd think you don't need this, but there's one reason why you do.
  // When Radix uses asChild in a Popover or other components, it clones
  // the child and adds ref, onClick, aria-haspopup, aria-expanded,
  // aria-controls, data-state and type="button". Without ...otherProps it
  // won't work.
  ...otherProps
}: SelectProps) => {
  const uid = React.useId()

  disabled =
    typeof disabled === 'boolean' ? disabled : typeof selectProps.disabled === 'boolean' ? selectProps.disabled : false

  error =
    error && typeof error === 'string'
      ? error
      : selectProps.error && typeof selectProps.error === 'string'
        ? selectProps.error
        : errorProps.children && typeof errorProps.children === 'string'
          ? errorProps.children
          : ''

  id = id && typeof id === 'string' ? id : selectProps.id && typeof selectProps.id === 'string' ? selectProps.id : uid

  touched =
    typeof touched === 'boolean' ? touched : typeof selectProps.touched === 'boolean' ? selectProps.touched : false

  /* ======================
      SelectBaseComponent
  ====================== */

  const SelectBaseComponent = (
    <SelectBase
      {...selectProps}
      {...(renderSelectBaseOnly === true ? otherProps : {})}

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

  if (renderSelectBaseOnly) {
    return SelectBaseComponent
  }

  return (
    <div {...groupProps} {...otherProps}>
      {renderLabel()}

      {typeof renderSelectBase === 'function' ? renderSelectBase(SelectBaseComponent) : SelectBaseComponent}

      <FormHelp {...helpProps} disabled={disabled} />

      <FormError {...errorProps} disabled={disabled} touched={touched}>
        {error}
      </FormError>
    </div>
  )
}
