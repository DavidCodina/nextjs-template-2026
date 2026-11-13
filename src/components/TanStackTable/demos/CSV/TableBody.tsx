import { flexRender } from '@tanstack/react-table'
import type { Table as TableInstance } from '@tanstack/react-table'

import type { LooseColumn, TBodyProps, TDProps, TRProps, TableVariant } from './types'

import { cn } from '@/utils'

export type TableBodyProps = {
  bodyProps: TBodyProps
  bodyRowProps: TRProps
  bodyCellProps: TDProps
  data: Record<string, any>[] | null
  columns: LooseColumn[] | null
  disabled: boolean
  enableGetSize: boolean
  highlightSelectedRows: boolean
  tableInstance: TableInstance<Record<string, any>>
  variant: TableVariant | undefined
}

/* ========================================================================

======================================================================== */

export const TableBody = ({
  bodyCellProps,
  bodyProps,
  bodyRowProps,
  columns,
  data,
  disabled,
  enableGetSize,
  highlightSelectedRows,
  tableInstance,
  variant
}: TableBodyProps) => {
  const renderTableBody = () => {
    // If data is an empty array when &&  status is neither
    // 'pending' nor 'error', then show "No Data..."

    if (Array.isArray(data) && data.length === 0) {
      return (
        <tbody {...bodyProps}>
          <tr {...bodyRowProps}>
            <td
              colSpan={columns?.length || 1}
              className={cn(
                'py-8 text-center text-lg font-medium',
                !disabled && variant === 'primary' && 'text-primary',
                !disabled && variant === 'secondary' && 'text-secondary',
                disabled && 'text-(--table-disabled-color)'
              )}
            >
              No Data...
            </td>
          </tr>
        </tbody>
      )
    }

    return (
      <tbody {...bodyProps}>
        {tableInstance
          .getRowModel()
          .rows //.slice(0, 10) // Demo only!
          .map((row) => {
            const isSelected = row.getIsSelected()

            return (
              <tr
                {...bodyRowProps}
                className={cn(bodyRowProps.className, isSelected && highlightSelectedRows && 'table-active')}
                key={row.id}
              >
                {row.getVisibleCells().map((cell) => (
                  <td
                    {...bodyCellProps}
                    key={cell.id}
                    className={cn(
                      bodyCellProps.className,

                      disabled && 'text-(--table-disabled-color)'
                    )}
                    style={{
                      width: enableGetSize ? cell.column.getSize() : undefined,
                      ...bodyCellProps.style
                    }}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            )
          })}
      </tbody>
    )
  }

  /* ======================
          return
  ====================== */

  return renderTableBody()
}
