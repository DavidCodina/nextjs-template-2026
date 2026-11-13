import { GlobalFilter } from './GlobalFilter'
import { Pagination } from './Pagination'
import { ExportCSVButton } from './ExportCSVButtton'
import { ColumnSelection } from './ColumnSelection'

import type { Table as TableInstance } from '@tanstack/react-table'

import type { ExportCSVButtonProps, GlobalFilterProps, TableVariant } from '../types'

import { cn } from '@/utils'

type TableControlsProps = {
  disabled: boolean
  noControlsShown: boolean
  showControls: boolean
  size: 'xs' | 'sm' | undefined
  tableInstance: TableInstance<Record<string, any>>
  variant: TableVariant | undefined

  /* =================== */

  enableGlobalFilter: boolean
  globalFilterProps: GlobalFilterProps

  /* =================== */

  enablePagination: boolean
  pageSize: number
  pageSizes?: number[]

  /* =================== */

  showExportCSVButton: boolean
  csvExportFileName: string
  csvHeaders?: any[]
  exportCSVButtonProps: Omit<
    ExportCSVButtonProps,
    'csvHeaders' | 'data' | 'disabled' | 'fileName' | 'showExportCSVButton' | 'size' | 'variant'
  >

  /* =================== */

  enableColumnSelection: boolean
}

/* ========================================================================

======================================================================== */
//# Some kind of props for Pagination component.
//# Some kind of props for ColumnSelection component.

export const TableControls = ({
  disabled = false,
  size,
  variant,
  showControls = true,
  noControlsShown = false,
  tableInstance,

  /* =================== */

  enableGlobalFilter, // Don't set default here!
  globalFilterProps, // Don't set default here!

  /* =================== */

  enablePagination = true,
  pageSize, // pageSize: pageSizeProp = 10,
  pageSizes = [10, 20, 30, 40, 50], // Note: pageSize will also added to the page size <select> during the mapping process.

  /* =================== */

  showExportCSVButton = false,
  csvExportFileName = '',
  csvHeaders,
  exportCSVButtonProps = {},

  /* =================== */

  enableColumnSelection = true
}: TableControlsProps) => {
  /* ======================
    renderExportCSVButton()
  ====================== */

  const renderExportCSVButton = () => {
    // Get data
    const data = tableInstance.options?.data

    // Get selected data
    const flatRows = tableInstance.getSelectedRowModel().flatRows
    const selectedData = flatRows.map((flatRow) => {
      return flatRow.original
    })

    const isSelectedData = Array.isArray(selectedData) && selectedData.length > 0

    // Set data to selectedData if it exists. Otherwise, default to entire dataset.
    const csvData = isSelectedData ? selectedData : data

    return (
      <ExportCSVButton
        {...exportCSVButtonProps}
        csvHeaders={csvHeaders}
        data={csvData}
        disabled={disabled}
        fileName={csvExportFileName}
        variant={variant}
        showExportCSVButton={showExportCSVButton}
        size='sm'
      />
    )
  }

  /* ======================
          return
  ====================== */
  //# Test responsiveness against different viewport sizes.

  if (!showControls || noControlsShown) return null

  return (
    <section className='bg-card flex flex-col gap-3 border-b border-(--table-border-color) p-3'>
      <div className={cn('flex flex-wrap items-start justify-center gap-3')}>
        <GlobalFilter
          {...globalFilterProps}
          className={cn(
            {
              'text-xs': size === 'xs',
              'text-sm': size === 'sm'
            },
            globalFilterProps?.className
          )}
          disabled={disabled}
          enableGlobalFilter={enableGlobalFilter}
        />

        {enablePagination && (
          <Pagination
            disabled={disabled}
            pageSize={pageSize}
            pageSizes={pageSizes}
            tableInstance={tableInstance}
            variant={variant}
          />
        )}

        {renderExportCSVButton()}
      </div>

      <ColumnSelection
        disabled={disabled}
        enableColumnSelection={enableColumnSelection}
        tableInstance={tableInstance}
        variant={variant}
      />
    </section>
  )
}
