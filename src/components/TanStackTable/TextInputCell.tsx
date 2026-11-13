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

// Ideally, the value would be a string, but what if it was undefined or
// even null? It's best to type it as unknown and treat it cautiously.
type UnknownValueType = unknown

type TextInputCellProps = Omit<React.ComponentProps<'input'>, 'type'> & {
  context: CellContext<any, UnknownValueType>
}

type UpdateDataArg = {
  rowIndex: number
  columnId: string
  // For TextInputCell this is string, for NumberInputCell it's number.
  value: string
}

type UpdateData = (arg: UpdateDataArg) => void

/* ========================================================================

======================================================================== */
// ⚠️ What if the value is a string, but the string is a number like "$123.45"?
// In that case, we may want to build a more custom InputCell to carefully
// handle what kinds of values are allowed.

//# What if we need additional validation?

//# What if we need a date picker?

//# What about deleting rows, or even adding rows?
//# https://www.youtube.com/watch?v=Pt3-5aPu1pE

export const TextInputCell = ({ className = '', context, onBlur, onChange, ...otherProps }: TextInputCellProps) => {
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

  /* ======================
      state & refs
  ====================== */

  const [value, setValue] = React.useState<UnknownValueType>(() => {
    // const isString = typeof tableValue === 'string'
    // if (!isString && process.env.NODE_ENV === 'development') {
    //   console.warn('TextInputCell initialized `value` state with a non-string value.')
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
  // though we sincerely hope it's a string.
  //
  // Why `alwaysStringOrNumber` rather than just `alwaysString`? If the data unexpectedly contains
  // a number value instead of the expected string, we can handle it more gracefully than merely
  // rendering ''. The <input type="text" /> will automatically convert it to a string.
  // This allows us to avoid rendering '' for that limited case. In all other non-string
  // cases, the input's value will simply be ''. This is not necessarily ideal, and is
  // essentially a silent failure. However, it's better than an actual error, or worse
  // actually indadvertently updating with an incorrect value.
  //
  ///////////////////////////////////////////////////////////////////////////
  const alwaysStringOrNumber = typeof value === 'string' || (typeof value === 'number' && !isNaN(value)) ? value : ''

  /* ======================
        handleBlur()
  ====================== */
  ///////////////////////////////////////////////////////////////////////////
  //
  // The actual call to updateData() happens on blur. Here again, we check
  // the actual local state value to see if it's of type string. If it's not
  // then reset `value` state to the current tableValue then return early,
  // prior to calling updateData().
  //
  // Note: the initial tableValue itself could still be an invalid type, but
  // ultimately that's okay. The critical concern here is that we don't call
  // updateData() with an invalid value type.
  //
  ///////////////////////////////////////////////////////////////////////////

  const handleBlur = () => {
    if (typeof value !== 'string') {
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
  //   ❌ TextInputCell cannot be used as a JSX component... unknown is not a valid JSX element type.
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
        handleBlur()
        onBlur?.(e)
      }}
      onChange={(e) => {
        setValue(e.target.value)
        onChange?.(e)
      }}
      type='text'
      value={alwaysStringOrNumber}
    />
  )
}
