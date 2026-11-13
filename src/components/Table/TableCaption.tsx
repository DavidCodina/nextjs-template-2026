'use client'

import * as React from 'react'
import { cn } from '@/utils'

export type TableCaptionProps = React.ComponentProps<'caption'>

const baseClasses = `
text-muted-foreground mt-4 text-sm
`

/* ========================================================================

======================================================================== */

export function TableCaption({ className = '', ...otherProps }: TableCaptionProps) {
  return <caption {...otherProps} data-slot='table-caption' className={cn(baseClasses, className)} />
}
