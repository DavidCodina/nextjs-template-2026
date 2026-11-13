'use client'

import * as React from 'react'
import { TableContainer } from './TableContainer'
import type { TableVariant } from './types'
import { cn } from '@/utils'

export type TableProps = React.ComponentProps<'table'> & {
  bordered?: boolean
  borderless?: boolean
  captionTop?: boolean
  /** Removes outer border from the actual table.
   * Can be used in conjunction with bordered/borderless.
   * Defaults to true to integrate with TableContainer.
   */
  flush?: boolean
  hover?: boolean
  /** Renders the table without the container. */
  renderTableOnly?: boolean
  size?: 'xs' | 'sm'
  striped?: boolean
  stripedColumns?: boolean
  tableContainerClassName?: string
  tableContainerStyle?: React.CSSProperties
  variant?: TableVariant
}

const tableBaseClasses = `shadcn-table`

/* ========================================================================

======================================================================== */
///////////////////////////////////////////////////////////////////////////
//
// This Table is based off of the ShadCN Table found here:
//
//   https://ui.shadcn.com/docs/components/radix/table
//
// Despite the URL referencing 'radix', neither Radix or Base UI primitives include
// a Table component. This Table extends the original ShadCN implementation with several
// props. This Table component is merely presentational/dumb. For a more full-featured,
// data-driven Table, integrate with Tanstack Table.
//
///////////////////////////////////////////////////////////////////////////

export const Table = ({
  bordered = false,
  borderless = false,
  captionTop = false,
  className = '',
  flush = true,
  hover = false,
  renderTableOnly = false,
  size,
  striped = false,
  stripedColumns = false,
  tableContainerClassName = '',
  tableContainerStyle = {},
  variant,
  ...otherProps
}: TableProps) => {
  /* ======================
          table 
  ====================== */

  const table = (
    <table
      {...otherProps}
      data-slot='table'
      className={cn(
        tableBaseClasses,
        captionTop && 'caption-top',
        bordered && 'table-bordered',
        borderless && !bordered && 'table-borderless',
        flush && 'table-flush',
        hover && 'table-hover',
        striped && 'table-striped',
        stripedColumns && 'table-striped-columns',
        { 'table-xs': size === 'xs', 'table-sm': size === 'sm' },
        {
          'shadcn-table-primary': variant === 'primary',
          'shadcn-table-secondary': variant === 'secondary'
        },
        className
      )}
    />
  )

  /* ======================
          return
  ====================== */

  if (renderTableOnly) {
    return table
  }

  return (
    <TableContainer className={tableContainerClassName} style={tableContainerStyle} variant={variant}>
      {table}
    </TableContainer>
  )
}
