'use client'

import * as React from 'react'
import { cn } from '@/utils'

export type TableFooterProps = React.ComponentProps<'tfoot'>

const baseClasses = ``

/* ========================================================================

======================================================================== */

export function TableFooter({ className, ...otherProps }: TableFooterProps) {
  return <tfoot {...otherProps} data-slot='table-footer' className={cn(baseClasses, className)} />
}
