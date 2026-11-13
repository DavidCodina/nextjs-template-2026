'use client'

import * as React from 'react'
import { cn } from '@/utils'

export type TableRowProps = React.ComponentProps<'tr'>

const baseClasses = ``

/* ========================================================================

======================================================================== */

export function TableRow({ className = '', ...otherProps }: TableRowProps) {
  return <tr {...otherProps} data-slot='table-row' className={cn(baseClasses, className)} />
}
