'use client'

import * as React from 'react'
import { Checkbox } from '@/components/Checkbox'
import { Label } from '../Label'
import { FormHelp } from '../FormHelp'
import { FormError } from '../FormError'
import { cn } from '@/utils'

import type { LabelProps } from '../Label'
import type { FormHelpProps } from '../FormHelp'
import type { FormErrorProps } from '../FormError'
import type { CheckboxBaseProps } from '../Checkbox/CheckboxBase'

type DataAttributes = {
  [key: `data-${string}`]: string | number | boolean | undefined
}

type GroupProps = React.ComponentProps<'div'>

// Ultimately, this is derived from the Radix Checkbox.Root
// The readonly string[] case specifically exists to support <input type="file">
// Exporting this is useful for typing state when consuming.
export type CheckboxValue = CheckboxBaseProps['value']

export type CheckboxItemType = {
  groupProps?: React.ComponentProps<'div'> & DataAttributes
  labelProps?: LabelProps & DataAttributes
  /** value is required. Why? When using CheckboxGroup, you're likely interested in
   * the associated values and not merely whether the checkbox was checked.
   */
  checkProps: Omit<CheckboxBaseProps, 'id' | 'error' | 'touched' | 'defaultChecked' | 'defaultValue'> &
    DataAttributes & {
      value: CheckboxValue
    }
}

type CheckboxGroupProps = {
  disabled?: boolean
  touched?: boolean
  error?: string
  id?: string
  name: string
  items: CheckboxItemType[]

  defaultValue?: CheckboxValue[]
  value?: CheckboxValue[]
  onBlur?: (values: CheckboxValue[]) => void
  onChange?: (values: CheckboxValue[]) => void

  groupProps?: GroupProps & DataAttributes
  labelProps?: LabelProps & DataAttributes
  errorProps?: FormErrorProps & DataAttributes
  helpProps?: FormHelpProps & DataAttributes
}

/* ========================================================================

======================================================================== */
// Unlike Base UI, Radix Primitives has no CheckboxGroup component,
// so we must compose it ourselves.

export const CheckboxGroup = ({
  disabled, // Do not set default
  error, // Do not set default
  id, // Do not set default
  touched, // Do not set default
  name, // Do not set default
  items = [],

  defaultValue,
  value: controlledValue,
  onBlur,
  onChange,

  groupProps = {},
  labelProps = {},
  helpProps = {},
  errorProps = {},

  // You'd think you don't need this, but there's one reason why you do.
  // When Radix uses asChild in a Popover or other components, it clones
  // the child and adds ref, onClick, aria-haspopup, aria-expanded,
  // aria-controls, data-state and type="button". Without ...otherProps it
  // won't work.
  ...otherProps
}: CheckboxGroupProps) => {
  const uid = React.useId()

  error =
    error && typeof error === 'string'
      ? error
      : errorProps.children && typeof errorProps.children === 'string'
        ? errorProps.children
        : ''

  id = id && typeof id === 'string' ? id : uid

  touched = typeof touched === 'boolean' ? touched : false

  /* ======================
        state & refs
  ====================== */
  ///////////////////////////////////////////////////////////////////////////
  //
  // Here we need state to track the array of checked values.
  // However, this means that resetting value must result from either
  // unmounting/remounting the component, or through a controlled implementation
  // that resets it externally. This may seem to be introducing potential problems
  // by using state here. For example, if the consuming component is drilling into
  // the DOM through a ref, then changing the internal <input type="checkbox" />
  // value, this will create a dissonance between the React state and the DOM.
  // That said, after a lot of experimentation, it just doesn't seem like Radix
  // form field primitives are designed to be reset through using refs.
  //
  // What they are designed for is to be reset through a controlled implementation.
  // In practice, that means that using state here should not actually be a problem.
  //
  ///////////////////////////////////////////////////////////////////////////

  const [value, setValue] = React.useState<CheckboxValue[]>(() => {
    if (Array.isArray(controlledValue)) {
      return controlledValue
    }

    if (Array.isArray(defaultValue) && defaultValue.length > 0) {
      return defaultValue
    }
    return []
  })

  const firstRenderRef = React.useRef(true)

  const checkboxGroupRef = React.useRef<HTMLDivElement>(null)

  /* ======================
        useEffect()
  ====================== */
  // Whenever value changes, call onChange().

  React.useEffect(() => {
    if (firstRenderRef.current === true) {
      return
    }
    onChange?.(value)
    // Omit onChange from the dependency array.
  }, [value]) // eslint-disable-line

  /* ======================
        useEffect()
  ====================== */
  // Every time controlledValue changes, conditionally call
  // setValue(controlledValue as Value[]) based on deep comparison.

  React.useEffect(() => {
    if (firstRenderRef.current === true) {
      return
    }

    ///////////////////////////////////////////////////////////////////////////
    //
    // Could do this to avoid ESLint complaining about the missing `value` dependency,
    // but running the if check on the outside is generally a better practice.
    //
    //   setValue((prev) => {
    //     if (JSON.stringify(controlledValue) !== JSON.stringify(prev)) {
    //       return controlledValue as Value[]
    //     }
    //     return prev
    //   })
    //
    ///////////////////////////////////////////////////////////////////////////

    // Note: Calling JSON.stringify([undefined]) will restult in '[null]'.
    // Then when you parse it back you will have null for the first element.
    // This is one of the quirks of JSON.stringify(). However, in this case,
    // it shouldn't be an issue.
    if (
      typeof controlledValue !== 'undefined' &&
      Array.isArray(controlledValue) &&
      JSON.stringify(controlledValue) !== JSON.stringify(value)
    ) {
      setValue(controlledValue as CheckboxValue[])
    }
  }, [controlledValue]) // eslint-disable-line

  /* ======================
        useEffect()
  ====================== */
  // Update firstRenderRef

  React.useEffect(() => {
    if (firstRenderRef.current === true) {
      firstRenderRef.current = false
      return
    }
  }, [])

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
     renderCheckboxes()
  ====================== */

  const renderCheckboxes = () => {
    return items.map((item, index) => {
      // value will also be on <button value="..." />
      // but that's tricker to access.

      const { groupProps: checkGroupProps, labelProps: checkLabelProps, checkProps } = item
      const checkId = `${id}-${index + 1}`
      const checkValue = checkProps.value

      return (
        <div
          // ⚠️ Gotcha: key must go before spread. Otherwise React complains.
          key={index}
          {...checkGroupProps}
          className={cn('mb-2 flex items-center gap-2', checkGroupProps?.className)}
        >
          <Checkbox
            {...checkProps}
            id={checkId}
            disabled={disabled || checkProps?.disabled}
            error={error}
            touched={touched}
            // Used to suppress error message UI in favor of a single group error message.
            _hideError

            labelProps={checkLabelProps}

            checkProps={{
              ...checkProps,
              checked: (() => {
                return value.includes(checkValue)
              })(),
              name: name,

              onBlur: (_checkedState) => {
                // Use setTimeout to create a new macrotask.
                setTimeout(() => {
                  // The onBlur should only run when the element that gets
                  // focus is outside of the checkbox group container.
                  // This creates the effect of a group blur.
                  const checkboxGroup = checkboxGroupRef.current
                  const activeElement = document.activeElement
                  if (checkboxGroup && checkboxGroup.contains(activeElement)) {
                    return
                  }
                  onBlur?.(value)
                }, 0)
              },
              // ⚠️ This is currently implemented under the assumption that each
              // checkbox value will be unique. If the values could potentially be
              // the same, then each value in values would need to be unique.
              onChange: (checkedState) => {
                if (checkedState === true) {
                  setValue((prev) => [...prev, checkValue])
                } else if (checkedState === false) {
                  setValue((prev) => prev.filter((v) => v !== checkValue))
                }
                // If checkedState is indeterminate, then do nothing...
              }
            }}
          />
        </div>
      )
    })
  }

  /* ======================
          return
  ====================== */

  return (
    <div
      {...groupProps}
      {...otherProps}
      className={cn(
        {
          'cursor-not-allowed': disabled
        },
        groupProps.className
      )}
      ref={(node) => {
        const ref = groupProps.ref
        if (ref && 'current' in ref) {
          ref.current = node
        } else if (typeof ref === 'function') {
          ref?.(node)
        }
        checkboxGroupRef.current = node
      }}
    >
      {renderGroupLabel()}
      {renderCheckboxes()}

      <FormHelp {...helpProps} disabled={disabled} />

      <FormError {...errorProps} disabled={disabled} touched={touched}>
        {error}
      </FormError>
    </div>
  )
}
