import * as React from 'react'
import { IndeterminateCheckbox } from '../../IndeterminateCheckbox'
import { Checkbox } from '../../Checkbox'

import type { ColumnSelectionProps } from '../../types'

import { cn } from '@/utils'

const checkGroupClasses = `flex gap-2 items-center`

/* ========================================================================

======================================================================== */

export const ColumnSelection = ({
  className = '',
  disabled = false,
  enableColumnSelection,
  style = {},
  tableInstance,
  variant,
  ...otherProps
}: ColumnSelectionProps) => {
  const id = React.useId()

  /* ======================
  renderIndeterminateCheckbox()
  ====================== */

  const renderIndeterminateCheckbox = () => {
    return (
      <div className={cn(checkGroupClasses)}>
        <IndeterminateCheckbox
          disabled={disabled}
          id={`table-toggle-all-columns-${id}`} // Should match associated label's htmlFor
          {...{
            indeterminate: tableInstance.getIsSomeColumnsVisible(),
            checked: tableInstance.getIsAllColumnsVisible(),
            onChange: tableInstance.getToggleAllColumnsVisibilityHandler()
          }}
          variant={variant}
        />
        <label
          className={cn(disabled ? 'pointer-events-none text-(--table-disabled-color)' : 'cursor-pointer')}
          htmlFor={`table-toggle-all-columns-${id}`}
        >
          Toggle All
        </label>
      </div>
    )
  }

  /* ======================
  renderColumnCheckboxes()
  ====================== */

  const renderColumnCheckboxes = () => {
    return tableInstance.getAllLeafColumns().map((column) => {
      let label = column.id

      const meta = column.columnDef.meta
      if (meta && 'label' in meta && typeof meta.label === 'string') {
        label = meta.label
      }

      return (
        <div className={checkGroupClasses} key={column.id}>
          <Checkbox
            id={`${column.id}-${id}`}
            disabled={disabled}
            {...{
              type: 'checkbox',
              checked: column.getIsVisible(),
              onChange: column.getToggleVisibilityHandler()
            }}
            variant={variant}
          />{' '}
          <label
            className={cn(disabled ? 'pointer-events-none text-(--table-disabled-color)' : 'cursor-pointer')}
            htmlFor={`${column.id}-${id}`}
          >
            {label}
          </label>
        </div>
      )
    })
  }

  /* ======================
          return 
  ====================== */

  if (!enableColumnSelection) return null

  return (
    <div
      {...otherProps}
      style={{
        fontSize: 12,
        padding: 5.5,
        ...style
      }}
      className={cn(
        'flex w-full flex-wrap justify-center gap-2.5 rounded border text-sm select-none',
        className,
        !disabled && variant === 'primary' && 'border-primary',
        !disabled && variant === 'secondary' && 'border-secondary',
        disabled && 'border-(--table-disabled-color)'
      )}
    >
      {renderIndeterminateCheckbox()}
      {renderColumnCheckboxes()}
    </div>
  )
}
