'use client'

import * as React from 'react'
import type { TableVariant } from './types'
import { cn } from '@/utils'

export type TableContainerProps = React.ComponentProps<'div'> & {
  variant?: TableVariant
}

const baseClasses = `shadcn-table-container`

/* ========================================================================

======================================================================== */

export const TableContainer = ({ className = '', variant, ...otherProps }: TableContainerProps) => {
  /* ======================
          return
  ====================== */

  return (
    <div
      {...otherProps}
      data-slot='table-container'
      className={cn(
        baseClasses,
        {
          'shadcn-table-primary': variant === 'primary',
          'shadcn-table-secondary': variant === 'secondary'
        },
        className
      )}
    />
  )
}
