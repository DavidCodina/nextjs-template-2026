'use client'

import * as React from 'react'
import { TextareaBase } from './TextareaBase'
import { Label } from '../label'
import { FormHelp } from '../FormHelp'
import { FormError } from '../FormError'
import { cn } from '@/utils'

import type { LabelProps } from '../label'
import type { FormHelpProps } from '../FormHelp'
import type { FormErrorProps } from '../FormError'

type DataAttributes = {
  [key: `data-${string}`]: string | number | boolean | undefined
}

type GroupProps = React.ComponentProps<'div'>

type TextareaProps = {
  disabled?: boolean
  touched?: boolean
  error?: string
  id?: string

  groupProps?: GroupProps & DataAttributes
  labelProps?: LabelProps & DataAttributes
  textareaProps?: React.ComponentProps<typeof TextareaBase> & DataAttributes
  errorProps?: FormErrorProps & DataAttributes
  helpProps?: FormHelpProps & DataAttributes

  renderTextareaBaseOnly?: boolean
}

/* ========================================================================

======================================================================== */

export const Textarea = ({
  disabled, // Do not set default
  error, // Do not set default
  id, // Do not set default
  touched, // Do not set default

  groupProps = {},
  labelProps = {},
  textareaProps = {},
  helpProps = {},
  errorProps = {},

  renderTextareaBaseOnly = false,
  // You'd think you don't need this, but there's one reason why you do.
  // When Radix uses asChild in a Popover or other components, it clones
  // the child and adds ref, onClick, aria-haspopup, aria-expanded,
  // aria-controls, data-state and type="button". Without ...otherProps it
  // won't work.
  ...otherProps
}: TextareaProps) => {
  const uid = React.useId()

  disabled =
    typeof disabled === 'boolean'
      ? disabled
      : typeof textareaProps.disabled === 'boolean'
        ? textareaProps.disabled
        : false

  error =
    error && typeof error === 'string'
      ? error
      : textareaProps.error && typeof textareaProps.error === 'string'
        ? textareaProps.error
        : errorProps.children && typeof errorProps.children === 'string'
          ? errorProps.children
          : ''

  id =
    id && typeof id === 'string'
      ? id
      : textareaProps.id && typeof textareaProps.id === 'string'
        ? textareaProps.id
        : uid

  touched =
    typeof touched === 'boolean' ? touched : typeof textareaProps.touched === 'boolean' ? textareaProps.touched : false

  /* ======================
    TextareaBaseComponent
  ====================== */

  const TextareaBaseComponent = (
    <TextareaBase
      {...textareaProps}
      {...(renderTextareaBaseOnly === true ? otherProps : {})}

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

  if (renderTextareaBaseOnly) {
    return TextareaBaseComponent
  }

  return (
    <div {...groupProps} {...otherProps}>
      {renderLabel()}

      {TextareaBaseComponent}

      <FormHelp {...helpProps} disabled={disabled} />

      <FormError {...errorProps} disabled={disabled} touched={touched}>
        {error}
      </FormError>
    </div>
  )
}
