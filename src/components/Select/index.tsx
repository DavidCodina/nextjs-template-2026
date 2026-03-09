'use client'

import * as React from 'react'
import { Select as SelectBase, SelectTrigger, SelectContent, SelectValue, SelectValueType } from './SelectBase'
import { Label } from '@/components/label'
import { FormHelp } from '@/components/FormHelp'
import { FormError } from '@/components/FormError'
import { cn } from '@/utils'

import type { SelectProps as SelectBaseProps } from './SelectBase/Select'
import type { SelectTriggerProps } from './SelectBase/SelectTrigger'
import type { SelectContentProps } from './SelectBase/SelectContent'
import type { LabelProps } from '../label'
import type { FormHelpProps } from '../FormHelp'
import type { FormErrorProps } from '../FormError'

type DataAttributes = {
  [key: `data-${string}`]: string | number | boolean | undefined
}

type GroupProps = React.ComponentProps<'div'>

type Children = SelectContentProps['children']
export type OnBlur = (value: SelectValueType) => void
export type OnChange = (value: SelectValueType) => void

type SelectProps = {
  disabled?: boolean
  touched?: boolean
  error?: string
  id?: string
  children: Children

  // # We may want to expose className, style, value, defaultValue, fieldSize, etc.

  groupProps?: GroupProps & DataAttributes
  labelProps?: LabelProps & DataAttributes
  selectProps?: SelectBaseProps & DataAttributes
  selectTriggerProps?: SelectTriggerProps & DataAttributes
  errorProps?: FormErrorProps & DataAttributes
  helpProps?: FormHelpProps & DataAttributes

  onBlur?: OnBlur
  onChange?: OnChange
  placeholder?: React.ReactNode
  renderSelectBase?: (selectBase: React.JSX.Element) => React.JSX.Element
  sideOffset?: number
}

/* ========================================================================

======================================================================== */
///////////////////////////////////////////////////////////////////////////
//
// This Select is built on top of the ShadCN Select. It adds several features,
// and aims to abstract some, but not all, of the composability.
//
// <Select>
//   <SelectGroup>
//     <SelectLabel>Fruit</SelectLabel>
//     <SelectItem value='apple'>Apple</SelectItem>
//     <SelectItem value='banana'>Banana</SelectItem>
//     <SelectItem value='blueberry'>Blueberry</SelectItem>
//     <SelectItem value='grapes'>Grapes</SelectItem>
//     <SelectItem value='pineapple'>Pineapple</SelectItem>
//   </SelectGroup>
// </Select>
//
///////////////////////////////////////////////////////////////////////////

const Select = ({
  disabled, // Do not set default
  error, // Do not set default
  id, // Do not set default
  touched, // Do not set default
  children, // Do not set default

  groupProps = {},
  labelProps = {},
  selectProps = {},
  selectTriggerProps = {},
  helpProps = {},
  errorProps = {},

  onBlur,
  onChange,
  placeholder = 'Select...',
  sideOffset = 0,
  renderSelectBase,
  // You'd think you don't need this, but there's one reason why you do.
  // When Radix uses asChild in a Popover or other components, it clones
  // the child and adds ref, onClick, aria-haspopup, aria-expanded,
  // aria-controls, data-state and type="button". Without ...otherProps it
  // won't work. Note: In this case certain focusing mechanisms in this component
  // generally seem to be at odds with a Popover implementation.
  ...otherProps
}: SelectProps) => {
  const uid = React.useId()

  disabled =
    typeof disabled === 'boolean'
      ? disabled
      : typeof selectTriggerProps.disabled === 'boolean'
        ? selectTriggerProps.disabled
        : false

  error =
    error && typeof error === 'string'
      ? error
      : selectTriggerProps.error && typeof selectTriggerProps.error === 'string'
        ? selectTriggerProps.error
        : errorProps.children && typeof errorProps.children === 'string'
          ? errorProps.children
          : ''

  id =
    id && typeof id === 'string'
      ? id
      : selectTriggerProps.id && typeof selectTriggerProps.id === 'string'
        ? selectTriggerProps.id
        : uid

  touched =
    typeof touched === 'boolean'
      ? touched
      : typeof selectTriggerProps.touched === 'boolean'
        ? selectTriggerProps.touched
        : false

  const defaultValue = selectProps.defaultValue
  const controlledValue = selectProps.value

  /* ======================
        state & refs
  ====================== */

  // It's very difficult to get the actual value from the Select component other
  // than on mount and onChange. The value state is used internally to store that
  // value, which can then be used by onBlur. However, we have to add a useEffect
  // and a state setter within onChange to make sure everythign stays in sync.
  const [value, setValue] = React.useState<SelectValueType>(() => {
    if (controlledValue && typeof controlledValue === 'string') {
      return controlledValue
    }

    if (defaultValue && typeof defaultValue === 'string') {
      return defaultValue
    }
    return ''
  })

  const selectContainerRef = React.useRef<HTMLDivElement>(null)
  const selectContentRef = React.useRef<HTMLDivElement>(null)
  const firstRenderRef = React.useRef(true)

  /* ======================
        useEffect()
  ====================== */
  // Every time controlledValue changes, conditionally call
  // setValue(controlledValue)

  React.useEffect(() => {
    if (firstRenderRef.current === true) {
      firstRenderRef.current = false
      return
    }

    if (typeof controlledValue !== 'undefined' && controlledValue !== value) {
      setValue(controlledValue)
    }
  }, [controlledValue]) // eslint-disable-line

  /* ======================
      SelectBaseComponent
  ====================== */

  const SelectBaseComponent = (
    <SelectBase
      {...selectProps}
      // {...(renderSelectBaseOnly === true ? otherProps : {})}

      // id goes on the SelectTrigger
      disabled={disabled}
      // error goes on the SelectTrigger
      // touched goes on the SelectTrigger
      defaultValue={defaultValue}

      onChange={(value) => {
        setValue(value)
        onChange?.(value)
      }}
      value={controlledValue}
    >
      <SelectTrigger
        {...selectTriggerProps}
        id={id}
        disabled={disabled}
        error={error}
        touched={touched}

        onBlur={() => {
          setTimeout(() => {
            // The onBlur should only run when the element that gets
            // focus is outside of the select container.
            // This creates the effect of a group blur.
            // In other words, it prevents blur behavior from occurring
            // when focus switches from the trigger to the menu.
            const selectContainer = selectContainerRef.current
            const selectContent = selectContentRef.current
            const activeElement = document.activeElement

            // The selectContent check is needed because the menu is likely portaled in.
            if (
              (selectContainer && selectContainer.contains(activeElement)) ||
              (selectContent && selectContent.contains(activeElement))
            ) {
              return
            }

            onBlur?.(value)
          }, 0)
        }}
      >
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>

      <SelectContent ref={selectContentRef} sideOffset={sideOffset}>
        {children}
      </SelectContent>
    </SelectBase>
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
    <div
      {...groupProps}
      {...otherProps}

      ref={(node) => {
        const ref = (otherProps as any).ref

        if (ref && 'current' in ref) {
          ref.current = node
        } else if (typeof ref === 'function') {
          ref?.(node)
        }
        selectContainerRef.current = node
      }}
    >
      {renderLabel()}

      {typeof renderSelectBase === 'function' ? renderSelectBase(SelectBaseComponent) : SelectBaseComponent}

      <FormHelp {...helpProps} disabled={disabled} />

      <FormError {...errorProps} disabled={disabled} touched={touched}>
        {error}
      </FormError>
    </div>
  )
}

export { SelectGroup, SelectLabel, SelectItem, SelectSeparator } from './SelectBase'
export { Select, type SelectValueType }
