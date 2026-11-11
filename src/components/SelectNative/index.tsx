'use client'

import * as React from 'react'
import { SelectNativeBase } from './SelectNativeBase'
import { Label } from '@/components/Label'
import { FormHelp } from '@/components/FormHelp'
import { FormError } from '@/components/FormError'
import { ChevronDownIcon } from 'lucide-react'
import { cn } from '@/utils'

import type { LabelProps } from '../Label'
import type { FormHelpProps } from '../FormHelp'
import type { FormErrorProps } from '../FormError'
import type { SelectNativeBaseProps } from './SelectNativeBase'

type DataAttributes = {
  [key: `data-${string}`]: string | number | boolean | undefined
}

type GroupProps = React.ComponentProps<'div'>
type Children = SelectNativeBaseProps['children']

type SelectNativeProps = {
  disabled?: boolean
  touched?: boolean
  error?: string
  id?: string
  children?: Children

  groupProps?: GroupProps & DataAttributes
  labelProps?: LabelProps & DataAttributes
  selectProps?: SelectNativeBaseProps & DataAttributes
  errorProps?: FormErrorProps & DataAttributes
  helpProps?: FormHelpProps & DataAttributes

  renderSelectBase?: (selectBase: React.JSX.Element) => React.JSX.Element
  renderSelectBaseOnly?: boolean
}

/* ========================================================================

======================================================================== */
// SelectNative was created as an alternative to the other Select component,
// which uses the Radix Primitive Select. While the Radix Select provides a nicer
// UI, the trade-off is that it's much more complex to set up and use. The Radix
// Select behavior is somewhat unintuitive. This version of Select might be preferable.

export const SelectNative = ({
  disabled, // Do not set default
  error, // Do not set default
  id, // Do not set default
  touched, // Do not set default
  children, // Do not set default

  groupProps = {},
  labelProps = {},
  selectProps = {},
  helpProps = {},
  errorProps = {},

  renderSelectBase,
  renderSelectBaseOnly = false,

  // You'd think you don't need this, but there's one reason why you do.
  // When Radix uses asChild in a Popover or other components, it clones
  // the child and adds ref, onClick, aria-haspopup, aria-expanded,
  // aria-controls, data-state and type="button". Without ...otherProps it
  // won't work.
  ...otherProps
}: SelectNativeProps) => {
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

  const multiple = typeof selectProps.multiple === 'boolean' ? selectProps.multiple : false

  /* ======================
    SelectBaseComponent
  ====================== */

  const SelectBaseComponent = (
    <SelectNativeBase
      {...selectProps}
      {...(renderSelectBaseOnly === true ? otherProps : {})}

      className={cn('appearance-none', selectProps.className)}
      id={id}
      disabled={disabled}
      error={error}
      multiple={multiple}
      touched={touched}
    >
      {children}
    </SelectNativeBase>
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

      {typeof renderSelectBase === 'function' ? (
        renderSelectBase(SelectBaseComponent)
      ) : !multiple ? (
        <div className='relative'>
          {SelectBaseComponent}
          <ChevronDownIcon
            className={cn('text-border pointer-events-none absolute top-1/2 right-2 size-4 -translate-y-1/2', {
              'text-destructive': error && !disabled,
              'text-success': !error && !disabled && touched
            })}
          />
        </div>
      ) : (
        SelectBaseComponent
      )}

      <FormHelp {...helpProps} disabled={disabled} />

      <FormError {...errorProps} disabled={disabled} touched={touched}>
        {error}
      </FormError>
    </div>
  )
}
