'use client'

import * as React from 'react'
import { cn } from '@/utils'

export type TableHeadProps = React.ComponentProps<'th'>

const baseClasses = ``

/* ========================================================================

======================================================================== */

export function TableHead({ className = '', ...otherProps }: TableHeadProps) {
  return <th {...otherProps} data-slot='table-head' className={cn(baseClasses, className)} />
}
