'use client'

import * as React from 'react'
import { cn } from '@/utils'
import { Label } from '../../Label'
import { FormHelp } from '../../FormHelp'
import { FormError } from '../../FormError'
import { SelectBase } from './SelectBase'

import type { LabelProps } from '../../Label'
import type { FormHelpProps } from '../../FormHelp'
import type { FormErrorProps } from '../../FormError'

type DataAttributes = {
  [key: `data-${string}`]: string | number | boolean | undefined
}

type GroupProps = React.ComponentProps<'div'>

export type ReactSelectProps = {
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
  renderSelectBase?: (SelectBase: React.JSX.Element) => React.JSX.Element
}

/* ========================================================================
                               ReactSelect
======================================================================== */

export const ReactSelect = ({
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
}: ReactSelectProps) => {
  /* ======================
          constants
    ====================== */

  const uid = React.useId()

  disabled =
    typeof disabled === 'boolean'
      ? disabled
      : typeof selectProps.disabled === 'boolean'
        ? selectProps.disabled
        : typeof selectProps.isDisabled === 'boolean'
          ? selectProps.isDisabled
          : false

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

  ///////////////////////////////////////////////////////////////////////////
  //
  // The id prop is applied to the top-level container.
  // To add an id to the actual input, use selectProps.inputId.
  // In the case of react-select, this is also the value we
  // want to pass to the label's htmlFor prop.
  //
  ///////////////////////////////////////////////////////////////////////////
  const inputId = selectProps.inputId ? selectProps.inputId : `input-${id}`

  ///////////////////////////////////////////////////////////////////////////
  //
  // If no instanceId is provided by the consumer, we can add one in order to avoid the following error:
  // https://stackoverflow.com/questions/61290173/react-select-how-do-i-resolve-warning-prop-id-did-not-match
  // next-dev.js:20 Warning: Prop `id` did not match.
  // Server: "react-select-4-live-region" Client: "react-select-3-live-region"
  // By default, this will generate an id of react-select-xxx-input on the associated <input>.
  //
  ///////////////////////////////////////////////////////////////////////////
  const instanceId = selectProps.instanceId ? selectProps.instanceId : `instance-${id}`

  /* ======================
      SelectBaseComponent
  ====================== */

  const SelectBaseComponent = (
    <SelectBase
      {...selectProps}
      {...(renderSelectBaseOnly === true ? otherProps : {})}
      id={id}
      inputId={inputId}
      instanceId={instanceId}
      isDisabled={disabled}
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
        htmlFor={inputId}
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
    <div {...groupProps} {...otherProps} suppressHydrationWarning>
      {renderLabel()}

      {typeof renderSelectBase === 'function' ? renderSelectBase(SelectBaseComponent) : SelectBaseComponent}

      <FormHelp {...helpProps} disabled={disabled} />

      <FormError {...errorProps} disabled={disabled} touched={touched}>
        {error}
      </FormError>
    </div>
  )
}
