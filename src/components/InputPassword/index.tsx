'use client'

import * as React from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { InputBase } from '@/components/Input/InputBase'
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

type InputPasswordProps = {
  disabled?: boolean
  touched?: boolean
  error?: string
  id?: string

  groupProps?: GroupProps & DataAttributes
  labelProps?: LabelProps & DataAttributes
  inputProps?: Omit<React.ComponentProps<typeof InputBase>, 'type'> & DataAttributes
  errorProps?: FormErrorProps & DataAttributes
  helpProps?: FormHelpProps & DataAttributes

  renderInputBase?: (inputBase: React.JSX.Element, inputType: string) => React.JSX.Element
}

/* ========================================================================

======================================================================== */

export const InputPassword = ({
  disabled, // Do not set default
  error, // Do not set default
  id, // Do not set default
  touched, // Do not set default

  groupProps = {},
  labelProps = {},
  inputProps = {},
  helpProps = {},
  errorProps = {},

  renderInputBase,

  // You'd think you don't need this, but there's one reason why you do.
  // When Radix uses asChild in a Popover or other components, it clones
  // the child and adds ref, onClick, aria-haspopup, aria-expanded,
  // aria-controls, data-state and type="button". Without ...otherProps it
  // won't work.
  ...otherProps
}: InputPasswordProps) => {
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

  const [inputType, setInputType] = React.useState<'password' | 'text'>('password')

  /* ======================
      InputBaseComponent
  ====================== */

  const InputBaseComponent = (
    <InputBase
      {...inputProps}
      // {...(renderInputBaseOnly === true ? otherProps : {})}

      id={id}
      disabled={disabled}
      error={error}
      touched={touched}
      type={inputType}
    />
  )

  /* ======================
      withPasswordButton 
  ====================== */

  const withPasswordButton = (
    <div className='relative'>
      {InputBaseComponent}

      <button
        className={cn(
          'text-border absolute top-1/2 right-px flex aspect-square h-[calc(100%-2px)] -translate-y-1/2 cursor-pointer items-center justify-center rounded-r-[0.375em] p-[0.25em]',
          {
            'text-destructive': error && !disabled,
            'text-success': !error && !disabled && touched
          }
        )}
        onClick={() => {
          setInputType((previousValue) => {
            if (previousValue === 'password') {
              return 'text'
            }
            return 'password'
          })
        }}
        title='Toggle Password'
        type='button'
      >
        {inputType === 'password' ? <Eye /> : <EyeOff className='h-full w-full' />}
        <span className='sr-only'>{inputType === 'password' ? 'Show' : 'Hide'}</span>
      </button>
    </div>
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

  return (
    <div {...groupProps} {...otherProps}>
      {renderLabel()}

      {typeof renderInputBase === 'function' ? renderInputBase(InputBaseComponent, inputType) : withPasswordButton}

      <FormHelp {...helpProps} disabled={disabled} />

      <FormError {...errorProps} disabled={disabled} touched={touched}>
        {error}
      </FormError>
    </div>
  )
}
