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
  // ColumnOrderState
  Column as ColumnObject,
  TableOptions as Options,
  // SortingState,
  Table as TableInstance,
  VisibilityState
} from '@tanstack/react-table'

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

type THeadProps = React.ComponentProps<'thead'>
type TBodyProps = React.ComponentProps<'tbody'>
type TFootProps = React.ComponentProps<'tfoot'>
type TRProps = React.ComponentProps<'tr'>

type THProps = React.ComponentProps<'th'>
type TDProps = React.ComponentProps<'td'>

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

/* ========================================================================

======================================================================== */

export type TableProps = {
  /** Passes disabled to pagination controls, filter inputs, sorting controls, etc. */
  disabled?: boolean
  data: Record<string, any>[] | null
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
  columnVisibility?: VisibilityState

  status: 'idle' | 'pending' | 'success' | 'error'
  apiRef?: React.RefObject<TableAPI | null>
  enableGetSize?: boolean
  enableGlobalFilter?: boolean
  enableColumnFilters?: boolean
  enablePagination?: boolean
  enableColumnSelection?: boolean
  showFooter?: boolean
  size?: 'xs' | 'sm'
  variant?: TableVariant

  bordered?: boolean
  borderless?: boolean
  flush?: boolean
  hover?: boolean
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

  pageIndex?: number
  pageSize?: number
  pageSizes?: number[]
  showControls?: boolean

  onSelectionChange?: (selectedData: Record<any, any>[]) => void
  onColumnVisibilityChange?: (newColumnVisibility: VisibilityState) => void
  highlightSelectedRows?: boolean
  enableRowSelection?: boolean

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

  globalFilterProps?: Omit<GlobalFilterProps, 'globalFilter' | 'setGlobalFilter'>
  columnFilterProps?: Omit<ColumnFilterProps, 'column'>
}
