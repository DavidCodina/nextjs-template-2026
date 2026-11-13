import { flexRender } from '@tanstack/react-table'

import type { Table as TableInstance } from '@tanstack/react-table'
import type { TFootProps, THProps, TRProps } from './types'

import { cn } from '@/utils'

export type TableFooterProps = {
  enableGetSize: boolean
  footProps: TFootProps
  footRowProps: TRProps
  footCellProps: THProps
  hasFooter: boolean
  showFooter: boolean
  tableInstance: TableInstance<Record<string, any>>
}

/* ========================================================================

======================================================================== */

export const TableFooter = ({
  enableGetSize,
  footCellProps,
  footProps,
  footRowProps,
  hasFooter,
  showFooter,
  tableInstance
}: TableFooterProps) => {
  /* ======================
          return
  ====================== */

  // Return null when no footer is detected in the column definition, or
  // when the showFooter prop is set to false.
  if (!hasFooter || !showFooter) {
    return null
  }

  return (
    <tfoot {...footProps}>
      {tableInstance.getFooterGroups().map((footerGroup) => (
        <tr {...footRowProps} key={footerGroup.id}>
          {footerGroup.headers.map((header) => (
            <th
              {...footCellProps}
              key={header.id}
              className={cn(footCellProps.className)}
              colSpan={header.colSpan}
              style={{
                width: enableGetSize ? header.getSize() : undefined,
                ...footCellProps.style
              }}
            >
              {header.isPlaceholder ? null : flexRender(header.column.columnDef.footer, header.getContext())}
            </th>
          ))}
        </tr>
      ))}
    </tfoot>
  )
}
