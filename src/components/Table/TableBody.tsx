'use client'

import * as React from 'react'
import { cn } from '@/utils'

export type TableBodyProps = React.ComponentProps<'tbody'>

const baseClasses = ``

/* ========================================================================

======================================================================== */

export function TableBody({ className = '', ...otherProps }: TableBodyProps) {
  return <tbody {...otherProps} data-slot='table-body' className={cn(baseClasses, className)} />
}
