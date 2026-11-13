'use client'

import * as React from 'react'
import { cn } from '@/utils'

export type TableHeaderProps = React.ComponentProps<'thead'>

const baseClasses = ``

/* ========================================================================

======================================================================== */

export const TableHeader = ({ className = '', ...otherProps }: TableHeaderProps) => {
  return <thead {...otherProps} data-slot='table-header' className={cn(baseClasses, className)} />
}
