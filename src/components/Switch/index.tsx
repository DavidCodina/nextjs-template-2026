'use client'

import * as React from 'react'
import { SwitchBase } from './SwitchBase'
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

type LabelChildren = LabelProps['children']

type SwitchProps = {
  disabled?: boolean
  touched?: boolean
  error?: string
  id?: string

  groupProps?: GroupProps & DataAttributes
  labelProps?: LabelProps &
    DataAttributes & {
      labelOn?: LabelChildren
      labelOff?: LabelChildren
    }
  switchProps?: React.ComponentProps<typeof SwitchBase> & DataAttributes
  errorProps?: FormErrorProps & DataAttributes
  helpProps?: FormHelpProps & DataAttributes

  renderSwitchBaseOnly?: boolean
}

/* ===================================d=====================================

======================================================================== */

export const Switch = ({
  disabled, // Do not set default
  error, // Do not set default
  id, // Do not set default
  touched, // Do not set default

  groupProps = {},
  labelProps = {},
  switchProps = {},
  helpProps = {},
  errorProps = {},
  renderSwitchBaseOnly = false,

  // You'd think you don't need this, but there's one reason why you do.
  // When Radix uses asChild in a Popover or other components, it clones
  // the child and adds ref, onClick, aria-haspopup, aria-expanded,
  // aria-controls, data-state and type="button". Without ...otherProps it
  // won't work.

  // Note: in this case, you can't put {...otherProps} direclty on SwitchBase.
  // SwitchBase uses data-state="checked" | data-state="unchecked".  {...otherProps}
  // will overwrite that with "opened" and "closed"
  ...otherProps
}: SwitchProps) => {
  const uid = React.useId()

  disabled =
    typeof disabled === 'boolean' ? disabled : typeof switchProps.disabled === 'boolean' ? switchProps.disabled : false

  error =
    error && typeof error === 'string'
      ? error
      : switchProps.error && typeof switchProps.error === 'string'
        ? switchProps.error
        : errorProps.children && typeof errorProps.children === 'string'
          ? errorProps.children
          : ''

  id = id && typeof id === 'string' ? id : switchProps.id && typeof switchProps.id === 'string' ? switchProps.id : uid

  touched =
    typeof touched === 'boolean' ? touched : typeof switchProps.touched === 'boolean' ? switchProps.touched : false

  const controlledChecked = switchProps.checked
  const defaultChecked = switchProps.defaultChecked

  // Do not allow labelOn and labelOff to go into Label
  const { labelOn = '', labelOff = '', ...otherLabelProps } = labelProps

  /* ======================
        state & refs
  ====================== */

  // The checked state is used internally to manage the display onText/offText.
  // checked state must be updated when onCheckedChange() is called and when
  // controlledChecked changes.
  const [checked, setChecked] = React.useState(() => {
    if (typeof controlledChecked === 'boolean') {
      return controlledChecked
    }
    if (typeof defaultChecked === 'boolean') {
      return defaultChecked
    }
    return false
  })

  const firstRenderRef = React.useRef(true)

  /* ======================
    SwitchBaseComponent
  ====================== */

  const SwitchBaseComponent = (
    <SwitchBase
      {...switchProps}
      // ❌ {...(renderSwitchBaseOnly === true ? otherProps : {})}

      id={id}
      disabled={disabled}
      error={error}
      touched={touched}
      onChange={(checked) => {
        setChecked(checked)
        switchProps.onChange?.(checked)
      }}
    />
  )

  /* ======================
        useEffect()
  ====================== */

  React.useEffect(() => {
    if (firstRenderRef.current === true) {
      firstRenderRef.current = false
      return
    }

    if (typeof controlledChecked === 'boolean' && controlledChecked !== checked) {
      setChecked(controlledChecked)
    }

    // Omit checked from the dependency array.
  }, [controlledChecked]) // eslint-disable-line

  /* ======================
        renderLabel()
  ====================== */

  const renderLabel = () => {
    const onNode = labelOn || labelProps.children
    const offNode = labelOff || labelProps.children

    if (!onNode || !offNode) {
      return null
    }

    return (
      <Label
        {...otherLabelProps}
        className={cn('text-xs', otherLabelProps.className)}
        disabled={disabled}
        error={error}
        htmlFor={id}
        touched={touched}
      >
        {checked ? onNode : offNode}
      </Label>
    )
  }

  /* ======================
          return
  ====================== */

  if (renderSwitchBaseOnly) {
    return SwitchBaseComponent
  }

  return (
    <div {...groupProps} {...otherProps}>
      <div className='flex items-center gap-2'>
        {SwitchBaseComponent}
        {renderLabel()}
      </div>

      <FormHelp {...helpProps} disabled={disabled} />

      <FormError {...errorProps} disabled={disabled} touched={touched}>
        {error}
      </FormError>
    </div>
  )
}
