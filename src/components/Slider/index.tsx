'use client'

import * as React from 'react'
import { SliderBase } from './SliderBase'
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

type SliderProps = {
  disabled?: boolean
  touched?: boolean
  error?: string
  id?: string

  groupProps?: GroupProps & DataAttributes
  labelProps?: LabelProps & DataAttributes
  sliderProps?: React.ComponentProps<typeof SliderBase> & DataAttributes
  errorProps?: FormErrorProps & DataAttributes
  helpProps?: FormHelpProps & DataAttributes

  renderSliderBaseOnly?: boolean
}

/* ========================================================================

======================================================================== */

function Slider({
  disabled, // Do not set default
  error, // Do not set default
  id, // Do not set default
  touched, // Do not set default

  groupProps = {},
  labelProps = {},
  sliderProps = {},
  helpProps = {},
  errorProps = {},

  renderSliderBaseOnly = false,

  // You'd think you don't need this, but there's one reason why you do.
  // When Radix uses asChild in a Popover or other components, it clones
  // the child and adds ref, onClick, aria-haspopup, aria-expanded,
  // aria-controls, data-state and type="button". Without ...otherProps it
  // won't work.
  ...otherProps
}: SliderProps) {
  const uid = React.useId()

  disabled =
    typeof disabled === 'boolean' ? disabled : typeof sliderProps.disabled === 'boolean' ? sliderProps.disabled : false

  error =
    error && typeof error === 'string'
      ? error
      : sliderProps.error && typeof sliderProps.error === 'string'
        ? sliderProps.error
        : errorProps.children && typeof errorProps.children === 'string'
          ? errorProps.children
          : ''

  id = id && typeof id === 'string' ? id : sliderProps.id && typeof sliderProps.id === 'string' ? sliderProps.id : uid

  touched =
    typeof touched === 'boolean' ? touched : typeof sliderProps.touched === 'boolean' ? sliderProps.touched : false

  /* ======================
    SliderBaseComponent
  ====================== */

  const SliderBaseComponent = (
    <SliderBase
      {...sliderProps}
      {...(renderSliderBaseOnly === true ? otherProps : {})}

      disabled={disabled}
      error={error}
      id={id}
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

  if (renderSliderBaseOnly) {
    return SliderBaseComponent
  }

  return (
    <div {...groupProps} {...otherProps}>
      {renderLabel()}

      {SliderBaseComponent}

      <FormHelp {...helpProps} disabled={disabled} />

      <FormError {...errorProps} disabled={disabled} touched={touched}>
        {error}
      </FormError>
    </div>
  )
}

export { Slider }
