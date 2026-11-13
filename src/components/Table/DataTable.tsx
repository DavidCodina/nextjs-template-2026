'use client'

import { Table } from './Table'
import { TableHeader } from './TableHeader'
import { TableRow } from './TableRow'
import { TableHead } from './TableHead'
import { TableBody } from './TableBody'
import { TableCell } from './TableCell'
import { TableFooter } from './TableFooter'

import type { TableProps } from './Table'
import type { TableHeaderProps } from './TableHeader'
import type { TableRowProps } from './TableRow'
import type { TableHeadProps } from './TableHead'
import type { TableBodyProps } from './TableBody'
import type { TableCellProps } from './TableCell'
import type { TableFooterProps } from './TableFooter'

import type { TableData } from './types'

type DataTableProps = {
  data: TableData | null | undefined
  loading?: boolean
  tableProps?: TableProps
  tableHeaderProps?: TableHeaderProps
  tableRowProps?: TableRowProps
  tableHeadProps?: TableHeadProps
  tableBodyProps?: TableBodyProps
  tableCellProps?: TableCellProps
  tableFooterProps?: TableFooterProps
}

/* ========================================================================

======================================================================== */
// Currently, there's no differentiation between tableRowProps used by the
// TableHeader, TableBody, and TableFooter. Similarly, the tableHeadProps
// are used both within TableHeader and TableFooter. We may want to further
// differentiate these props for maximum flexibility.

export const DataTable = ({
  data,
  loading = false,
  tableProps = {},
  tableHeaderProps = {},
  tableRowProps = {},
  tableHeadProps = {},
  tableBodyProps = {},
  tableCellProps = {},
  tableFooterProps = {}
}: DataTableProps) => {
  /* ======================
          return
  ====================== */
  // This is a quick and dirty fix, for when there's no data.
  // However, a more robust approach would entail a built-in skeleton,
  // or the use of a skeleton component on the consuming side.
  if (!data || loading) return null

  return (
    <Table {...tableProps}>
      {data.header && (
        <TableHeader {...tableHeaderProps}>
          <TableRow {...tableRowProps}>
            {data.header.map((cell, cellIndex) => (
              <TableHead key={cellIndex} {...tableHeadProps}>
                {cell}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
      )}

      <TableBody {...tableBodyProps}>
        {data.body.map((row, rowIndex) => (
          <TableRow key={rowIndex} {...tableRowProps}>
            {row.map((cell, cellIndex) => (
              <TableCell key={cellIndex} {...tableCellProps}>
                {cell}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>

      {data.footer && (
        <TableFooter {...tableFooterProps}>
          <TableRow {...tableRowProps}>
            {data.footer.map((cell, cellIndex) => (
              <TableHead key={cellIndex} {...tableHeadProps}>
                {cell}
              </TableHead>
            ))}
          </TableRow>
        </TableFooter>
      )}
    </Table>
  )
}
