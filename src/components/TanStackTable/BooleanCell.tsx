import * as React from 'react'
import { Button } from '../Button'

import type { CellContext } from '@tanstack/react-table'
import { cn } from '@/utils'

// Ideally, the value would be a boolean, but what if it was undefined or
// even null? It's best to type it as unknown and treat it cautiously.
type UnknownValueType = unknown

type BooleanCellProps = {
  context: CellContext<any, UnknownValueType>
}

type UpdateDataArg = {
  rowIndex: number
  columnId: string
  value: boolean
}

type UpdateData = (arg: UpdateDataArg) => void

const baseClasses = `
min-w-[50px] flex-1 font-mono font-medium [font-size:inherit]
disabled:bg-(--table-disabled-color)
disabled:opacity-65
`

/* ========================================================================

======================================================================== */
// This is an MVP. One may eventually want to switch to using ButtonGroup, or some other UI.

export const BooleanCell = ({ context }: BooleanCellProps) => {
  const { column, getValue, row, table } = context

  const tableValue = getValue()

  const tableMeta = table.options.meta

  const updateData = tableMeta && 'updateData' in tableMeta ? (tableMeta.updateData as UpdateData) : undefined

  const variant =
    tableMeta && 'variant' in tableMeta && typeof tableMeta.variant === 'string' ? tableMeta.variant : undefined

  const buttonDefaultVariant: any = typeof variant === 'string' ? variant : 'primary'

  const disabled =
    tableMeta && 'disabled' in tableMeta && typeof tableMeta.disabled === 'boolean' ? tableMeta.disabled : false

  const editable =
    tableMeta && 'editable' in tableMeta && typeof tableMeta.editable === 'boolean' ? tableMeta.editable : false

  /* ======================
      state & refs
  ====================== */

  const [value, setValue] = React.useState<UnknownValueType>(tableValue)

  /* ======================
         useEffect()
  ====================== */

  React.useEffect(() => {
    setValue(tableValue)
  }, [tableValue])

  /* ======================
          return
  ====================== */

  if (editable !== true) {
    return typeof value === 'boolean' ? value.toString() : '-'
  }

  return (
    <div className='flex items-center justify-center gap-1'>
      <Button
        className={cn(baseClasses, value !== true && !disabled && 'opacity-50 dark:opacity-70')}
        disabled={disabled}
        onClick={() => {
          setValue(true)

          if (typeof updateData === 'function') {
            updateData({
              rowIndex: row.index,
              columnId: column.id,
              value: true
            })
          }
        }}
        // Rather than explicitly setting the size here, we can use [font-size:inherit]
        // Because the app's Button component has intrinsic sizing built entirely around
        // em units, this means that Button will inherently resize itself appropriately
        // based on the inherited font size.
        // ❌ size='md'
        type='button'
        variant={disabled ? 'neutral' : buttonDefaultVariant}
      >
        true
      </Button>
      <Button
        className={cn(baseClasses, value !== false && !disabled && 'opacity-50 dark:opacity-70')}
        disabled={disabled}
        onClick={() => {
          setValue(false)

          if (typeof updateData === 'function') {
            updateData({
              rowIndex: row.index,
              columnId: column.id,
              value: false
            })
          }
        }}
        // ❌ size='md'
        type='button'
        variant={disabled ? 'neutral' : buttonDefaultVariant}
      >
        false
      </Button>
    </div>
  )
}
