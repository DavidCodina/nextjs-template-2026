'use client'

import * as React from 'react'
import { RadioGroupBase, RadioGroupItemBase } from './RadioGroupBase'
import { Label } from '../label'
import { FormHelp } from '../FormHelp'
import { FormError } from '../FormError'
import { cn } from '@/utils'

import type { LabelProps } from '../label'
import type { FormHelpProps } from '../FormHelp'
import type { FormErrorProps } from '../FormError'

import type { RadioGroupItemBaseProps } from './RadioGroupBase/RadioGroupItemBase'

import type { RadioValue, DefaultRadioValue, OnBlur, OnChange } from './RadioGroupBase'

type DataAttributes = {
  [key: `data-${string}`]: string | number | boolean | undefined
}

type GroupProps = React.ComponentProps<'div'>

export type RadioItemType = {
  groupProps?: React.ComponentProps<'div'> & DataAttributes
  labelProps?: LabelProps & DataAttributes
  radioProps: Omit<RadioGroupItemBaseProps, 'id' | 'error' | 'touched'> & DataAttributes
}

// It's kind of difficult to know what to call this.
type RootProps = Omit<
  React.ComponentProps<typeof RadioGroupBase>,
  'asChild' | 'required' | 'orientation' | 'dir' | 'name'
>

type RadioGroupProps = {
  disabled?: boolean
  touched?: boolean
  error?: string
  id?: string
  /** The name attribute shared by all 'radios'. By default,
   * RadioGroupPrimitive.Root allows this to be undefined.
   * Here, it is required.
   */
  name: string
  items: RadioItemType[]

  defaultValue?: DefaultRadioValue
  value?: RadioValue
  onBlur?: OnBlur
  onChange?: OnChange

  groupProps?: GroupProps & DataAttributes
  labelProps?: LabelProps & DataAttributes
  rootProps: RootProps & DataAttributes
  errorProps?: FormErrorProps & DataAttributes
  helpProps?: FormHelpProps & DataAttributes
}

/* ========================================================================

======================================================================== */

const RadioGroup = ({
  disabled, // Do not set default
  error, // Do not set default
  id, // Do not set default
  touched, // Do not set default
  name, // Do not set default
  items = [],

  // Technically, these are already on rootProps, but they are exposed
  // at the top-level for convenience and for fidelity with CheckboxGroup,
  // which has no concept of rootProps.
  defaultValue, // Do not set default
  value: controlledValue, // Do not set default
  onBlur,
  onChange,

  groupProps = {},
  labelProps = {},
  rootProps = {},
  helpProps = {},
  errorProps = {},

  // You'd think you don't need this, but there's one reason why you do.
  // When Radix uses asChild in a Popover or other components, it clones
  // the child and adds ref, onClick, aria-haspopup, aria-expanded,
  // aria-controls, data-state and type="button". Without ...otherProps it
  // won't work.
  ...otherProps
}: RadioGroupProps) => {
  const uid = React.useId()

  disabled =
    typeof disabled === 'boolean' ? disabled : typeof rootProps.disabled === 'boolean' ? rootProps.disabled : false

  error =
    error && typeof error === 'string'
      ? error
      : errorProps.children && typeof errorProps.children === 'string'
        ? errorProps.children
        : ''

  id = id && typeof id === 'string' ? id : rootProps.id && typeof rootProps.id === 'string' ? rootProps.id : uid

  touched = typeof touched === 'boolean' ? touched : false

  defaultValue =
    defaultValue && typeof defaultValue === 'string'
      ? defaultValue
      : rootProps.defaultValue && typeof rootProps.defaultValue === 'string'
        ? rootProps.defaultValue
        : undefined

  controlledValue =
    controlledValue && typeof controlledValue === 'string'
      ? controlledValue
      : rootProps.value && typeof rootProps.value === 'string'
        ? rootProps.value
        : undefined

  onBlur =
    onBlur && typeof onBlur === 'function'
      ? onBlur
      : rootProps.onBlur && typeof rootProps.onBlur === 'function'
        ? rootProps.onBlur
        : undefined

  onChange =
    onChange && typeof onChange === 'function'
      ? onChange
      : rootProps.onChange && typeof rootProps.onChange === 'function'
        ? rootProps.onChange
        : undefined

  /* ======================
      renderGroupLabel()
  ====================== */

  const renderGroupLabel = () => {
    if (!labelProps.children) {
      return null
    }

    return (
      <Label
        {...labelProps}
        asChild
        className={cn('mb-2', labelProps.className)}
        disabled={disabled}
        error={error}
        touched={touched}
      >
        <div>{labelProps.children}</div>
      </Label>
    )
  }

  /* ======================
        renderRadios()
  ====================== */

  const renderRadios = () => {
    return items.map((item, index) => {
      const { groupProps: radioGroupProps, labelProps: radioLabelProps, radioProps } = item

      const radioId = `${id}-${index + 1}`

      return (
        <div
          // ⚠️ Gotcha: key must go before spread. Otherwise React complains.
          key={index}
          {...radioGroupProps}
          className={cn('flex items-center gap-2', radioGroupProps?.className)}
        >
          <RadioGroupItemBase
            {...radioProps}
            id={radioId}
            disabled={disabled || radioProps?.disabled}
            error={error}
            touched={touched}
          />

          {radioLabelProps && radioLabelProps.children && (
            <Label
              {...radioLabelProps}
              className={cn('text-xs', radioLabelProps.className)}
              disabled={disabled || radioLabelProps.disabled}
              error={error}
              htmlFor={radioId}
              touched={touched}
            >
              {radioLabelProps.children}
            </Label>
          )}
        </div>
      )
    })
  }

  /* ======================
          return
  ====================== */

  return (
    <div {...groupProps} {...otherProps}>
      {renderGroupLabel()}

      <RadioGroupBase
        {...rootProps}

        value={controlledValue}

        defaultValue={defaultValue}

        onBlur={onBlur}

        onChange={onChange}

        // Note: In a Radix UI RadioGroup component, when both value and defaultValue props
        // are provided (and both are defined strings), the value prop will always
        // take precedence over the defaultValue.
        disabled={disabled}
        name={name}
      >
        {renderRadios()}
      </RadioGroupBase>

      <FormHelp {...helpProps} disabled={disabled} />

      <FormError {...errorProps} disabled={disabled} touched={touched}>
        {error}
      </FormError>
    </div>
  )
}

export { RadioGroup, RadioValue }
