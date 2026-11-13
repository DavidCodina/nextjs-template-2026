import * as React from 'react'
import { isRenderable } from './utils'

import type { CellContext } from '@tanstack/react-table'

import { cn } from '@/utils'

const FIELD_BOX_SHADOW_MIXIN = `shadow-xs`

const FIELD_FOCUS_MIXIN = `
focus-visible:shadow-none
focus-visible:border-(--table-border-color)
focus-visible:ring-[3px]
focus-visible:ring-(--table-border-color)/40
`

const FIELD_DISABLED_MIXIN = `
disabled:pointer-events-none
disabled:border-(--table-disabled-color)
disabled:placeholder:text-(--table-disabled-color)
disabled:opacity-65
`

// Don't set text-base here. Instead, let the input inherit the size from the table.
const baseClasses = `
flex bg-card
w-full min-w-[180px]
px-[0.5em] py-[0.25em]
leading-[1.5] font-normal
border border-(--table-border-color) outline-none
rounded-[0.375em]
text-ellipsis overflow-hidden
placeholder:text-muted-foreground
${FIELD_BOX_SHADOW_MIXIN}
${FIELD_FOCUS_MIXIN}
${FIELD_DISABLED_MIXIN}
`

// Ideally, the value would be a number, but what if it was undefined or
// even null? It's best to type it as unknown and treat it cautiously.
type UnknownValueType = unknown

type NumberInputCellProps = Omit<React.ComponentProps<'input'>, 'type'> & {
  context: CellContext<any, UnknownValueType>
  noDecimal?: boolean
  noNegative?: boolean
}

type UpdateDataArg = {
  rowIndex: number
  columnId: string
  // For TextInputCell this is string, for NumberInputCell it's number.
  value: number
}

type UpdateData = (arg: UpdateDataArg) => void

/* ========================================================================

======================================================================== */

export const NumberInputCell = ({
  className = '',
  context,
  noDecimal = false,
  noNegative = false,
  onBlur,
  onChange,
  onKeyDown,
  onPaste,
  step,
  ...otherProps
}: NumberInputCellProps) => {
  const { column, getValue, row, table } = context

  const tableValue = getValue()

  const tableMeta = table.options.meta
  // const columnMeta = column.columnDef.meta

  // The updateData() function is hardcoded in the useReactTable
  // options. The check here is merely to appease TypeScript.
  const updateData = tableMeta && 'updateData' in tableMeta ? (tableMeta.updateData as UpdateData) : undefined

  ///////////////////////////////////////////////////////////////////////////
  //
  // There's actually no need for variant or size. Why? Because the Tailwind styles use --table-border-color,
  // which itself hooks into the current theme color. Additionally, size is derived entirely from the inherited
  // font size.
  //
  // const _variant = tableMeta && 'variant' in tableMeta && typeof tableMeta.variant === 'string' ? tableMeta.variant : undefined
  // const _size = tableMeta && 'size' in tableMeta && typeof tableMeta.size === 'string' ? tableMeta.size : undefined
  //
  ///////////////////////////////////////////////////////////////////////////

  const disabled =
    tableMeta && 'disabled' in tableMeta && typeof tableMeta.disabled === 'boolean' ? tableMeta.disabled : false

  // Following the initial value of editable state in the main TanStackTable component.
  // it makes the most sense to default to false. However, the default here should never
  // actually get used, because in fact there's always a value for tableMeta.editable.
  const editable =
    tableMeta && 'editable' in tableMeta && typeof tableMeta.editable === 'boolean' ? tableMeta.editable : false

  step = typeof step !== 'undefined' ? step : noDecimal === true ? 1 : undefined

  /* ======================
      state & refs
  ====================== */

  const [value, setValue] = React.useState<UnknownValueType>(() => {
    // const isNumber = typeof tableValue === 'number' && !isNaN(tableValue)
    // if (!isNumber && process.env.NODE_ENV === 'development') {
    //   console.warn('NumberInputCell initialized `value` state with a non-number value.')
    // }
    return tableValue
  })

  ///////////////////////////////////////////////////////////////////////////
  //
  // The `alwaysStringOrNumber` is passed to input's value prop to mitigate potential
  // errors/warnings when value ends up being something unexpected. For example:
  //
  //   ❌ The `value` prop on `input` should not be null. Consider using an empty
  //   string to clear the component or `undefined` for uncontrolled components.
  //
  // However, the actual local state `value` is still allowed to be anything,
  // though we sincerely hope it's a number.
  //
  ///////////////////////////////////////////////////////////////////////////
  const alwaysStringOrNumber = typeof value === 'string' || (typeof value === 'number' && !isNaN(value)) ? value : ''

  /* ======================
        handleBlur()
  ====================== */
  ///////////////////////////////////////////////////////////////////////////
  //
  // The actual call to updateData() happens on blur. Here again, we check
  // the actual local state value to see if it's of type number. If it's not
  // then reset `value` state to the current tableValue then return early,
  // prior to calling updateData().
  //
  // Note: the initial tableValue itself could still be an invalid type, but
  // ultimately that's okay. The critical concern here is that we don't call
  // updateData() with an invalid value type.
  //
  ///////////////////////////////////////////////////////////////////////////

  const handleBlur = () => {
    if (typeof value !== 'number') {
      setValue(tableValue)
      return
    }

    if (typeof updateData === 'function') {
      updateData({
        rowIndex: row.index,
        columnId: column.id,
        value: value
      })
    }
  }

  /* ======================
         useEffect()
  ====================== */
  // Ensure local state is in sync with outer table state.
  // This kind of seems redundant, but it's a good failsafe.

  React.useEffect(() => {
    setValue(tableValue)
  }, [tableValue])

  /* ======================
          return
  ====================== */
  ///////////////////////////////////////////////////////////////////////////
  //
  // Rather than typing UnknownValueType as React.ReactNode, we can assert React.ReactNode here.
  // Why is this necessary? If TypeScript sees the value as unknown, it will complain when
  // one attempts to consume the component in columns.tsx file:
  //
  //   ❌ NumberInputCell cannot be used as a JSX component... unknown is not a valid JSX element type.
  //
  // That said, prefer isRenderable() over type assertion of: `as React.ReactNode`
  //
  ///////////////////////////////////////////////////////////////////////////

  if (editable !== true) {
    if (!isRenderable(tableValue)) return null
    return tableValue
  }

  return (
    <input
      {...otherProps}
      className={cn(baseClasses, className)}
      disabled={disabled}
      onBlur={(e) => {
        onBlur?.(e)
        handleBlur()
      }}
      onChange={(e) => {
        onChange?.(e)
        // Note: values like 2E+2 actually output here as 200.
        // However, the actual value in the input will still be 2E+2.
        // For this reason, onKeyDown + onPaste reject special characters.
        let newValue = e.target.valueAsNumber

        if (typeof newValue !== 'number' || isNaN(newValue)) {
          // Note: handleBlur() will spot ''. Then it will reset to
          // tableValue, opting out of updateData(). This is the way.
          setValue('')
          return
        }

        if (noDecimal && !Number.isInteger(newValue)) {
          newValue = Math.trunc(newValue)
        }

        if (noNegative && newValue < 0) {
          newValue = 0
        }

        setValue(newValue)
      }}
      onKeyDown={(e) => {
        onKeyDown?.(e)
        // Prevent special characters.
        if (e.key === 'e' || e.key === 'E' || e.key === '+') {
          e.preventDefault()
          return
        }

        if (noDecimal && e.key === '.') {
          e.preventDefault()
          return
        }
        if (noNegative && e.key === '-') {
          e.preventDefault()
          return
        }
      }}
      onPaste={(e) => {
        onPaste?.(e)
        // Reject pasted values with special characters.
        const pasted = e.clipboardData.getData('text')
        if (/[eE+]/.test(pasted)) {
          e.preventDefault()
        }
      }}
      step={step}
      type='number'
      value={alwaysStringOrNumber}
    />
  )
}
