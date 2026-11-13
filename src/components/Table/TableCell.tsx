'use client'

import * as React from 'react'
import { cn } from '@/utils'

export type TableCellProps = React.ComponentProps<'td'>

const baseClasses = ``

/* ========================================================================

======================================================================== */
// Text content within a TableCell will attempt to wrap, but then the
// table will become scrollable because the TableContainer has a
// overflow-x: auto style.

export function TableCell({ className = '', ...otherProps }: TableCellProps) {
  return <td {...otherProps} data-slot='table-cell' className={cn(baseClasses, className)} />
}
