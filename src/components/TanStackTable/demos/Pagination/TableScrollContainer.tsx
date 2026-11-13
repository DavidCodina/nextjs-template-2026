import type { ScrollContainerProps } from './types'

import { cn } from '@/utils'

/* ========================================================================

======================================================================== */

export const TableScrollContainer = ({ children, className = '', ...otherProps }: ScrollContainerProps) => {
  return (
    <div {...otherProps} data-slot='table-scroll-container' className={cn('shadcn-table-scroll-container', className)}>
      {children}
    </div>
  )
}
