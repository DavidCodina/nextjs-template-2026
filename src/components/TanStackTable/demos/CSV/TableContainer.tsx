import type { TableContainerProps, TableVariant } from './types'

import { cn } from '@/utils'

/* ========================================================================

======================================================================== */

export const TableContainer = ({
  children,
  className = '',
  disabled = false,
  variant,
  ...otherProps
}: TableContainerProps & {
  variant: TableVariant | undefined
}) => {
  return (
    <div
      {...otherProps}
      data-slot='table-container'
      className={cn(
        'shadcn-table-container rounded-xl',

        !disabled && variant === 'primary' && '[--table-border-color:var(--color-primary)]',

        !disabled && variant === 'secondary' && '[--table-border-color:var(--color-secondary)]',

        disabled && '[--table-border-color:var(--table-disabled-color)]',

        className
      )}
      // style={{ borderRadius: 15, WebkitOverflowScrolling: 'touch' }}
    >
      {' '}
      {children}
    </div>
  )
}
