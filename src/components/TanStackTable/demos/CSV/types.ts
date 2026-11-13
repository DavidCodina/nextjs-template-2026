///////////////////////////////////////////////////////////////////////////
//
// Gotcha, this will change the definitions globally, and might cause
// issues for other component implementations. On the other hand, it
// also seems necessary if you want to use the fuzzy filter.
//
//   declare module '@tanstack/react-table' {
//     interface FilterFns {
//       fuzzy?: FilterFn<unknown>
//     }
//     interface FilterMeta {
//       itemRank: RankingInfo
//     }
//   }
//
///////////////////////////////////////////////////////////////////////////

import type {
  ColumnDef,
  // ColumnFiltersState,
  Column as ColumnObject,
  ColumnOrderState,
  TableOptions as Options,
  // SortingState,
  Table as TableInstance,
  VisibilityState
} from '@tanstack/react-table'

import type { VariantProps } from 'class-variance-authority'

import type { csvButtonVariants } from './TableControls/ExportCSVButtton/csvButtonVariants'

export type TableOptions = Options<Record<string, any>>
export type TableAPI = TableInstance<Record<string, any>>

// Note: Tanstack Table also exports a Column type, but that refers
// to the mapped header.column data (i.e., ColumnObject)
export type Column = ColumnDef<Record<string, any>, any>
export type LooseColumn = Record<string, any>

export type TableContainerProps = React.ComponentProps<'div'> & {
  disabled?: boolean
}
export type ScrollContainerProps = React.ComponentProps<'div'>

type TableElementProps = React.ComponentProps<'table'>

export type THeadProps = React.ComponentProps<'thead'>
export type TBodyProps = React.ComponentProps<'tbody'>
export type TFootProps = React.ComponentProps<'tfoot'>
export type TRProps = React.ComponentProps<'tr'>

export type THProps = React.ComponentProps<'th'>
export type TDProps = React.ComponentProps<'td'>

// React.InputHTMLAttributes<HTMLInputElement>
type InputProps = React.ComponentProps<'input'>

export type DebouncedInpuProps = Omit<InputProps, 'onChange'> & {
  debounce?: number
  onChange: (value: any) => void // Docs do: (value: string | number) => void
  value: string | number
}

export type GlobalFilterProps = Omit<DebouncedInpuProps, 'onChange' | 'value'> & {
  globalFilter: string
  setGlobalFilter: React.Dispatch<React.SetStateAction<string>>
  enableGlobalFilter?: boolean
}

export type ColumnFilterProps = Omit<DebouncedInpuProps, 'onChange' | 'value'> & {
  column: ColumnObject<Record<string, any>, unknown>
}

export type TableVariant = 'primary' | 'secondary'

export type ColumnSelectionProps = React.ComponentProps<'div'> & {
  disabled?: boolean
  enableColumnSelection: boolean | undefined
  tableInstance: TableInstance<Record<string, any>>
  variant?: TableVariant
}

export type ExportCSVButtonProps = React.ComponentProps<'button'> &
  VariantProps<typeof csvButtonVariants> & {
    csvHeaders?: any[] // https://github.com/react-csv/react-csv#nested-json-data
    data: Record<any, any>[]
    fileName: string
    showExportCSVButton: boolean
  }

/* ========================================================================

======================================================================== */

export type TableProps = {
  apiRef?: React.RefObject<TableAPI | null>
  bordered?: boolean
  borderless?: boolean
  ///////////////////////////////////////////////////////////////////////////
  //
  // ⚠️ If you type columns with the official type of: ColumnDef<Record<string, any>, any>[] (i.e., Columns)
  // Then it makes it very strict on the consuming side. Here we can instead use LooseColumns, so that
  // the consumer can define the columns type on in a more relaxed manner:
  //
  //  const [columns, setColumns] = useState<Record<string, any>[] | null>(null)
  //
  // However, here TypeScript will complain that
  //
  //   Type 'LooseColumns' is not assignable to type 'ColumnDef<Record<string, any>, any>[]'.
  //
  // So you have to assert `as Columns` within useReactTable. Moreover, useReactTable doesn't like
  // null or undefined values for data or columns properties so it's crucial that you fall back to [].
  //
  // Overall, the trade-off with LooseColumns is decreased type safety for greater ease of use in consumption.
  // In production, this may not be a great idea, but it works for now.
  //
  ///////////////////////////////////////////////////////////////////////////
  columns: LooseColumn[] | null
  data: Record<string, any>[] | null

  /** Passes disabled to pagination controls, filter inputs, sorting controls, etc. */
  disabled?: boolean
  enableGetSize?: boolean
  flush?: boolean
  hover?: boolean
  showControls?: boolean
  showFooter?: boolean
  size?: 'xs' | 'sm'
  status: 'idle' | 'pending' | 'success' | 'error'
  striped?: boolean
  stripedColumns?: boolean
  tableOptions?: Omit<
    TableOptions,
    | 'columns'
    | 'data'
    | 'getCoreRowModel'
    | 'getSortedRowModel'
    | 'getFilteredRowModel'
    | 'getPaginationRowModel'
    | 'globalFilterFn'
    | 'sortingFns'
    | 'filterFns'
    | 'state'
    | 'onColumnFiltersChange'
    | 'onGlobalFilterChange'
    | 'onColumnVisibilityChange'
    | 'onRowSelectionChange'
    | 'onSortingChange'
  >
  variant?: TableVariant

  /* =================== */

  tableContainerProps?: TableContainerProps
  scrollContainerProps?: ScrollContainerProps
  tableProps?: TableElementProps
  headProps?: THeadProps
  headRowProps?: TRProps
  headCellProps?: THProps
  bodyProps?: TBodyProps
  bodyRowProps?: TRProps
  bodyCellProps?: TDProps
  footProps?: TFootProps
  footRowProps?: TRProps
  footCellProps?: THProps

  /* =================== */

  enableGlobalFilter?: boolean
  globalFilterProps?: Omit<GlobalFilterProps, 'globalFilter' | 'setGlobalFilter'>

  enableColumnFilters?: boolean
  columnFilterProps?: Omit<ColumnFilterProps, 'column'>

  /* =================== */

  enablePagination?: boolean
  pageIndex?: number
  pageSize?: number
  pageSizes?: number[]

  /* =================== */

  enableColumnSelection?: boolean
  columnVisibility?: VisibilityState
  onColumnVisibilityChange?: (newColumnVisibility: VisibilityState) => void

  /* =================== */

  enableRowSelection?: boolean
  highlightSelectedRows?: boolean
  onSelectionChange?: (selectedData: Record<any, any>[]) => void

  /* =================== */

  columnOrder?: ColumnOrderState

  /* =================== */

  /** Defaults to exported-data.csv */
  csvExportFileName?: string
  /** Passing in csvHeaders allows one to limit what fields are exported.
   * It also allows one to relabel the properties when being exported. */
  csvHeaders?: any[]
  showExportCSVButton?: boolean
  exportCSVButtonProps?: Omit<
    ExportCSVButtonProps,
    'csvHeaders' | 'data' | 'disabled' | 'fileName' | 'showExportCSVButton' | 'size' | 'variant'
  >
}
