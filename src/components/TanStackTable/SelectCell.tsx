import * as React from 'react'
import { ChevronDown } from 'lucide-react'
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
appearance-none block bg-card
w-full min-w-[150px]
pl-[0.5em] pr-[1.25em] py-[0.25em]
leading-[1.5] font-normal
border border-(--table-border-color) outline-none
rounded-[0.375em]
cursor-pointer
text-ellipsis overflow-hidden
${FIELD_BOX_SHADOW_MIXIN}
${FIELD_FOCUS_MIXIN}
${FIELD_DISABLED_MIXIN}
`

type UnknownValueType = unknown

type SelectCellProps = React.ComponentProps<'select'> & {
  context: CellContext<any, UnknownValueType>
}

type UpdateDatdaArg = {
  rowIndex: number
  columnId: string
  value: string
}

type UpdateData = (arg: UpdateDatdaArg) => void

/* ========================================================================

======================================================================== */

export const SelectCell = ({ children, className = '', context, ...otherProps }: SelectCellProps) => {
  const { column, getValue, row, table } = context

  const tableValue = getValue()

  const tableMeta = table.options.meta
  // const columnMeta = column.columnDef.meta

  // The updateData() function is hardcoded in the useReactTable options.
  // The check here is merely to appease TypeScript.
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

  const [value, setValue] = React.useState<UnknownValueType>(tableValue)

  const alwaysStringOrNumber = typeof value === 'string' || (typeof value === 'number' && !isNaN(value)) ? value : ''

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

  if (editable !== true) {
    if (!isRenderable(tableValue)) return null
    return tableValue
  }

  return (
    <div className='relative'>
      <select
        {...otherProps}
        className={cn(baseClasses, className)}
        disabled={disabled}
        onChange={(e) => {
          const newValue = e.target.value

          // Even though <select> can technically accept string | number, the
          // e.target.value is always coerced to a string. This is probably overly
          // defensive, but also doesn't hurt.
          if (typeof newValue !== 'string') {
            setValue(tableValue)
            return
          }

          // Otherwise...
          setValue(newValue)

          if (typeof updateData === 'function') {
            updateData({
              rowIndex: row.index,
              columnId: column.id,
              value: newValue
            })
          }
        }}
        value={alwaysStringOrNumber}
      >
        {children}
      </select>

      <div className='pointer-events-none absolute top-0 right-1 flex h-full items-center'>
        <ChevronDown
          className={cn(
            'size-[1.25em] text-(--table-border-color)',
            disabled && 'text-(--table-border-color) opacity-65'
          )}
        />
      </div>
    </div>
  )
}
