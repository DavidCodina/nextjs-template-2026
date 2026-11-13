import * as React from 'react'
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable
  // FilterFn,
  // getFilteredRowModel,
  // InitialTableState,
} from '@tanstack/react-table'
import { AlertCircle, ArrowUpDown, MoveDown, MoveUp } from 'lucide-react'
// import { RankingInfo } from '@tanstack/match-sorter-utils'

import { Alert } from '../../../Alert'
import { defaultColumnSizing, sortingFns } from './tableInstanceOptions'

import { TableContainer } from './TableContainer'
import { TableScrollContainer } from './TableScrollContainer'
import { Pagination } from './Pagination'
import { ColumnSelection } from './ColumnSelection'
import { IndeterminateCheckbox } from './IndeterminateCheckbox'
import { Checkbox } from './Checkbox'
import { fuzzyFilter } from './filters'
import { ColumnFilter } from './ColumnFilter'
import { GlobalFilter } from './GlobalFilter'

import type { ColumnFiltersState, InitialTableState, SortingState } from '@tanstack/react-table'
import type { Column, TableAPI, TableOptions, TableProps } from './types'

import { cn } from '@/utils'

// No need to explicitly set a background color.
// The shadcn-table class does this: background-color: var(--table-bg),
// which itself refers to --color-card
const tableBaseClasses = `shadcn-table`

function isBooleanObject(arg: any): arg is Record<string, boolean> {
  if (typeof arg !== 'object' || arg === null) {
    return false
  }

  for (const key in arg) {
    if (!arg.hasOwnProperty(key)) {
      continue // Skip inherited properties
    }

    const value = arg[key]
    if (typeof value !== 'boolean') {
      return false
    }
  }

  return true
}

/* ========================================================================

======================================================================== */
///////////////////////////////////////////////////////////////////////////
//
// The basic idea here is that Table will receive data, which is simply an
// array of objects. It also receives columns, which is also an array of
// objects. However, the columns array is used to map a property in each
// data object to a particular column.
//
// Additionally, this custom Table abstraction uses the status prop to
// to render error UI, loading UI, or the data (i.e., the table).
//
/////////////////////////
//
// Sorting Resources:
//
//   https://tanstack.com/table/v8/docs/guide/sorting
//   https://tanstack.com/table/v8/docs/api/features/sorting
//   https://tanstack.com/table/latest/docs/framework/react/examples/sorting
//   https://github.com/TanStack/table/blob/main/packages/table-core/src/sortingFns.ts
//
/////////////////////////
//
// Filtering Resources:
//
//   https://tanstack.com/table/v8/docs/guide/global-filtering
//   https://tanstack.com/table/v8/docs/api/features/global-filtering
//   https://tanstack.com/table/v8/docs/guide/column-filtering
//   https://tanstack.com/table/v8/docs/api/features/column-filtering
//   https://tanstack.com/table/v8/docs/guide/fuzzy-filtering
//   https://tanstack.com/table/v8/docs/framework/react/examples/filters-fuzzy
//   https://github.com/TanStack/table/blob/main/packages/table-core/src/filterFns.ts
//
///////////////////////////////////////////////////////////////////////////

export const Table = ({
  apiRef,
  bordered = false,
  borderless = false,
  columns,
  columnVisibility: columnVisibilityProp = {},
  onColumnVisibilityChange,
  data,
  disabled = false,
  enableColumnFilters, // Don't set default here!
  enableGetSize = false,
  enableGlobalFilter, // Don't set default here!
  enablePagination = true,
  enableColumnSelection = true,

  flush = true,
  hover = false,
  showFooter = true,
  size,
  status,
  striped = false,
  stripedColumns = false,
  tableOptions = {},
  variant,

  /* =================== */

  onSelectionChange,
  highlightSelectedRows = false,
  enableRowSelection, // Don't set default here!

  /* =================== */

  tableContainerProps = {},
  scrollContainerProps = {},
  tableProps = {},
  headProps = {},
  headRowProps = {},
  headCellProps = {},
  bodyProps = {},
  bodyRowProps = {},
  bodyCellProps = {},
  footProps = {},
  footRowProps = {},
  footCellProps = {},
  globalFilterProps = {},
  columnFilterProps = {},

  //# Some kind of props for Pagination component.
  //# Some kind of props for ColumnSelection component.

  /* =================== */
  // TanStack table configuration props.

  pageIndex = 0,
  pageSize: pageSizeProp = 10,
  pageSizes = [10, 20, 30, 40, 50], // Note: pageSize will also added to the page size <select> during the mapping process.
  showControls = true

  /* =================== */

  /* =================== */

  // className & style props for pagination.
  // paginationClassName = '',
  // paginationStyle = {},
  // paginationItemClassName = '',
  // paginationItemStyle = {},
  // paginationButtonClassName = '',
  // paginationButtonStyle = {},
  // pageNumberInputClassName = '',
  // pageNumberInputStyle = {},
  // pageSizeSelectClassName = '',
  // pageSizeSelectStyle = {},

  /* =================== */

  // controlsClassName = '',
  // controlsStyle = {},

  /* =================== */

  // titleContainerClassName = '',
  // titleContainerStyle = {},

  // title = '',
  // titleClassName = '',
  // titleStyle = {},

  // subtitle = ''
  // subtitleClassName = '',
  // subtitleStyle = {},
}: TableProps) => {
  // It's possible that columns and/or data  might be null or undefined
  // on mount. This could potentially break some of the logic here.
  // columns = Array.isArray(columns) ? columns : []
  data = Array.isArray(data) ? data : []

  disabled = typeof disabled === 'boolean' ? disabled : false

  enableGlobalFilter =
    typeof enableGlobalFilter === 'boolean'
      ? enableGlobalFilter
      : typeof tableOptions.enableGlobalFilter === 'boolean'
        ? tableOptions.enableGlobalFilter
        : true

  enableColumnFilters =
    typeof enableColumnFilters === 'boolean'
      ? enableColumnFilters
      : typeof tableOptions.enableColumnFilters === 'boolean'
        ? tableOptions.enableColumnFilters
        : true

  // enableRowSelection defaults to false. Because many tables will
  // not need this feature, it's best to make it opt-in.
  enableRowSelection =
    typeof enableRowSelection === 'boolean'
      ? enableRowSelection
      : typeof tableOptions.enableRowSelection === 'boolean'
        ? tableOptions.enableRowSelection
        : false

  /* ======================
        state & refs
  ====================== */

  const [globalFilter, setGlobalFilter] = React.useState('')
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [sorting, setSorting] = React.useState<SortingState>([])

  // We could have an initialRowSelection prop that we pass in.
  const [rowSelection, setRowSelection] = React.useState<Record<string, boolean>>({})

  // Initialize columnVisibility using columnVisibilityProp.
  // Otherwise default to {}. columnVisibility is always an object columnIds
  // keys and boolean values. A column is visible if the key/value is omitted
  // or if it is set to true. A column is not visible when it's key is listed
  // and the associated value is explicitly set to false.
  const [columnVisibility, setColumnVisibility] = React.useState<Record<string, boolean>>(() => {
    return isBooleanObject(columnVisibilityProp) ? columnVisibilityProp : {}
  })

  const firstRenderRef = React.useRef(true)

  /* ======================
        Derived State
  ====================== */

  // Check the first column to see if it has a footer property.
  // If so, we can assume that all columns have a footer property.
  const firstColumn = Array.isArray(columns) && columns[0] ? columns[0] : {}

  // Used to determine if a footer <th> should be created when building selectableColumn.
  // Also used as part of conditional statement that determines whether or not to render <tfoot>.
  const hasFooter = firstColumn.hasOwnProperty('footer')

  const dataLength = data?.length || 0

  const noControlsShown = !enableGlobalFilter && !enablePagination && !enableColumnSelection

  ///////////////////////////////////////////////////////////////////////////
  //
  // Why are we using this? We need to pass columnVisibilityProp into a useEffect(), but
  // we'll end up runing into this error:
  //
  //   Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render.
  //
  // This happens because the useEffect() that watches columnVisibilityProp also updates the internal
  // columnVisibility, which then ends up potentially triggering an infinite loop.
  //
  ///////////////////////////////////////////////////////////////////////////
  const stringifiedColumnVisibilityProp = isBooleanObject(columnVisibilityProp)
    ? JSON.stringify(columnVisibilityProp)
    : JSON.stringify({})

  /* ======================
        Pagination  
  ====================== */
  // If enablePagination is false, then set pageSize to the length of data.
  // This will work during initialization. However, in order to make
  // the enablePagination prop dynamically update, we also do this below
  // the table initialization: if (!enablePagination) { table.setPageSize(data.length) }

  const pageSize = enablePagination === true ? pageSizeProp : dataLength

  /* ======================
      Memoize Columns 
  ====================== */
  // We can't assume that columns has been memoized, has been stored in state, or
  // is being imported from a static file. For that reason, we still need to wrap
  // it in useMemo() before passing it into the table instance.

  const cols = React.useMemo(() => {
    if (!Array.isArray(columns)) {
      return []
    }
    return columns
  }, [columns])

  ///////////////////////////////////////////////////////////////////////////
  //
  // In the case of the selectableColumn, we DEFINITELY don't want
  // it recreated on every render, so we MUST memoize it.
  //
  // Note: if you want to pass props to IndetermateCheckbox and/or Checkbox
  // from the outside, then you'll likely need to JSON.stringify() them from
  // outside of useMemo() then JSON.parse() them from within useMemo(). Otherwise,
  // things like the style prop will break the memoization. However, you should also
  // be aware that any handlers like onChange, onClick, etc. will be silently dropped.
  // Why? JSON.stringify just skips them without throwing any error or warning.
  //
  // Perhaps a better alternative would be to have an indeterminateCheckboxPropsRef,
  // and/or checkboxPropsRef to get around the useMemo dependency array. However,
  // if you wanted it to always stay up to date, you'd also need a useEffect that would
  // watch for changes to the props themselves and then update the ref(s).
  //
  // In any case, there's currently no need to expose props for the IndetermateCheckbox and/or Checkbox.
  //
  ///////////////////////////////////////////////////////////////////////////

  const colsPlusSelectable = React.useMemo(() => {
    const selectableColumn: Column = {
      // ⚠️ This id is being hardcoded. It's crucial that the consumer be
      // aware that this is ALWAYS the column id for this specific column.
      id: 'row_select',

      header: ({ table }) => {
        return (
          <IndeterminateCheckbox
            aria-label={
              table.getIsAllRowsSelected()
                ? 'Deselect all rows'
                : table.getIsSomeRowsSelected()
                  ? 'Some rows selected — select all rows'
                  : 'Select all rows'
            }
            disabled={disabled}
            {...{
              indeterminate: table.getIsSomeRowsSelected(),
              checked: table.getIsAllRowsSelected(),
              onChange: table.getToggleAllRowsSelectedHandler()
            }}
            variant={variant}
          />
        )
      },

      cell: ({ row }) => {
        return (
          <Checkbox
            disabled={disabled}
            {...{
              checked: row.getIsSelected(),
              onChange: row.getToggleSelectedHandler()
            }}
            aria-label={`${row.getIsSelected() ? 'Deselect' : 'Select'} row`}
            variant={variant}
          />
        )
      },

      enableSorting: false,
      meta: { label: 'Row Select' }
    }

    if (hasFooter) {
      selectableColumn.footer = ({ table }) => (
        <IndeterminateCheckbox
          aria-label={
            table.getIsAllRowsSelected()
              ? 'Deselect all rows'
              : table.getIsSomeRowsSelected()
                ? 'Some rows selected — select all rows'
                : 'Select all rows'
          }
          disabled={disabled}
          {...{
            indeterminate: table.getIsSomeRowsSelected(),
            checked: table.getIsAllRowsSelected(),
            onChange: table.getToggleAllRowsSelectedHandler()
          }}
          variant={variant}
        />
      )
    }

    // Initially was just doing  ...columns, but was getting this TypeScript error:
    // Type 'LooseColumn[] | null' must have a '[Symbol.iterator]()' method that returns an iterator.
    // The spread operator ... requires the value to be iterable. null is not iterable, so TypeScript
    // complains when columns is typed as LooseColumn[] | null — even though you have an
    // Array.isArray(columns) check earlier in the component, TypeScript doesn't narrow the type of
    // columns inside the useMemo callback because that narrowing doesn't carry over into a separate closure.
    return [selectableColumn, ...(columns ?? [])]
  }, [columns, disabled, hasFooter, variant])

  /* ======================
    Table Initialization
  ====================== */
  // I was getting a React Compiler warning that I had to silence,
  // but that seems to have gone away for some reason.
  // --- eslint-disable-next-line react-hooks/incompatible-library

  ///////////////////////////////////////////////////////////////////////////
  //
  // Note: the docs show two different ways of implementing client-side pagination.
  // https://tanstack.com/table/latest/docs/guide/pagination
  //
  //   1. You can explicitly implement pagination state:
  //
  //     const [pagination, setPagination] = useState({
  //       pageIndex: 0, //initial page index
  //       pageSize: 10, //default page size
  //     })
  //
  //   Then pass it to state: { pagination }
  //
  //   2. Alternatively, if you have no need for managing the pagination state
  //   in your own scope, but you need to set different initial values for the
  //   pageIndex and pageSize, you can use the initialState option.
  //
  // We are using the second option here.
  //
  ///////////////////////////////////////////////////////////////////////////

  const initialState: InitialTableState = {
    pagination: {
      // By default, pageIndex is reset to 0 when page-altering state changes occur,
      // such as when the data is updated, filters change, grouping changes, etc.
      pageIndex: pageIndex,
      pageSize: pageSize
    }
  }

  // eslint-disable-next-line react-hooks/incompatible-library
  const tableInstance = useReactTable({
    data: data,

    // Old: columns: cols as Column[],
    // If you add an array in here, then it will cause an infinite rerender.
    // This is why we memoize cols and colsPlusSelectable instead.
    columns: enableRowSelection ? (colsPlusSelectable as Column[]) : (cols as Column[]),

    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    // Fun fact: conditionally adding/removing getPaginationRowModel based on the value of
    // enablePagination won't actually work because it's consumed only once during initialization.
    // ...(enablePagination ? { getPaginationRowModel: getPaginationRowModel() } : {}),
    getPaginationRowModel: getPaginationRowModel(),
    filterFns: {
      fuzzy: fuzzyFilter // Define as a filter function that can be used in column definitions
    },

    // Note: when a change occurs, it usually entails two renders. Why?
    // Presumably, the table updates its internal state causing a render, then
    // it calls the associated setter. I'm not sure if this is actually the
    // case, but I wittled the Table all the way down to just the sorting feature,
    // and it still double-rendered. Thus, it's not an optimization issue related
    // to how I implemented it. Rather, it's just the way it works with Tanstack table.
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting, // Optional: control sorting state in your own scope for easy access

    onColumnVisibilityChange: (updater) => {
      // The updater is this:
      // (old) => ({ ...old, [column.id]: value != null ? value : !column.getIsVisible() })
      // Which is why what you actually want to send back to the consumer is the custom columnVisibility state.
      setColumnVisibility(updater)
    },
    onRowSelectionChange: setRowSelection,
    globalFilterFn: 'includesString', // 'fuzzy', // Apply fuzzy filter to the global filter (most common use case for fuzzy filter),

    // The type defs define this as: sortingFns?: Record<string, SortingFn<any>>
    // However, if we add a custom sortingFn, it will work when used by a
    // column definition, but TypeScript seems not to recognize it.
    sortingFns: sortingFns,

    state: {
      columnFilters,
      globalFilter,
      sorting,
      columnVisibility,
      rowSelection
      // columnOrder,
    },

    // https://tanstack.com/table/v8/docs/api/core/table#initialstate
    initialState: initialState,

    enableGlobalFilter: enableGlobalFilter,
    enableColumnFilters: enableColumnFilters,
    enableRowSelection: enableRowSelection,

    defaultColumn: {
      ...defaultColumnSizing,
      ...tableOptions?.defaultColumn
      // We may choose to do this in production for all tables.
      // sortUndefined: 'last'
    },

    // debugTable: true,
    // debugHeaders: true,
    // debugColumns: false

    // autoResetPageIndex: false, // turn off page index reset when sorting or filtering - default on/true
    // enableMultiSort: false, // Don't allow shift key to sort multiple columns - default on/true
    // enableSorting: false, // - default on/true
    // enableSortingRemoval: false, // Don't allow - default on/true
    // isMultiSortEvent: (e) => true, //Make all clicks multi-sort - default requires `shift` key
    // maxMultiSortColCount: 3, // only allow 3 columns to be sorted at once - default is Infinity

    ...tableOptions
  })

  // useEffect(() => {
  //   const logAutoFilterFns = () => {
  //     if (!tableInstance || typeof tableInstance.getAllColumns !== 'function') { return }
  //     const allColumns = tableInstance?.getAllColumns()
  //     if (!Array.isArray(allColumns)) { return }
  //     allColumns.forEach((column) => {
  //       if (column && 'id' in column && 'getAutoFilterFn' in column) {
  //         console.log('\n\n')
  //         console.log(`${column?.id}:`, column?.getAutoFilterFn())
  //         console.dir(column?.getAutoFilterFn())
  //       }
  //     })
  //   }
  //   logAutoFilterFns()
  // })

  /* ======================
      Column Visibility  
  ====================== */

  const visibleLeafColumns = tableInstance.getVisibleLeafColumns() // => [ ... ]

  // If no columns are visible then we return null in the JSX instead of showing the table.
  const atLeastOneVisibleColumn = Array.isArray(visibleLeafColumns) && visibleLeafColumns.length > 0

  ///////////////////////////////////////////////////////////////////////////
  //
  // This useEffect() watches for changes to stringifiedColumnVisibilityProp
  // such that on change, it will call table.setColumnVisibility(). This
  // allows changes to the visible columns to be dynamically passed in
  // from the consuming environment.
  //
  // It seems counterintuitive, but here we do the following:
  //
  //   ✅ tableInstance.setColumnVisibility(parsedColumnVisibilityProp)
  //   ❌ setColumnVisibility(parsedColumnVisibilityProp)
  //
  // The control flow of the two-way binding is tricky to conceptualize. However, it seems
  // that when one updates in this way, it will trigger the options.onColumnVisibilityChange,
  // which in turn updates the explicit/local columnVisibility state.
  //
  // The final piece of the two-way binding entails the next useEffect() which watches
  // for changes to columnVisibility, then calls handleColumnVisibilityChange?.(columnVisibility)
  //
  // After trying several alternative approaches, this seems to be the way that keeps everything
  // in sync while also avoiding race conditions and infinite loops.
  //
  ///////////////////////////////////////////////////////////////////////////

  React.useEffect(() => {
    if (firstRenderRef.current === true) {
      return
    }

    const parsedColumnVisibilityProp = JSON.parse(stringifiedColumnVisibilityProp)
    // Rather than asserting parsedColumnVisibilityProp as VisibilityState,
    // we can use a typeguard. Otherwise, we'll get a TypeScript complaint:
    // Argument of type 'unknown' is not assignable to parameter of type 'Updater<VisibilityState>'.
    if (isBooleanObject(parsedColumnVisibilityProp)) {
      tableInstance.setColumnVisibility(parsedColumnVisibilityProp)
    }
  }, [stringifiedColumnVisibilityProp, tableInstance])

  ///////////////////////////////////////////////////////////////////////////
  //
  // This useEffect() watches for changes to local columnVisibility state.
  // If it changes AND there's a columnVisibilityChange prop, then
  // it executes that callback, passing the internal columnVisibility state
  // back out to the consuming environment. This allows an externally controlled
  // implementation to stay in sync with any internal state changes. The use
  // of a ref here is merely a hack to bypass the useEffect's dependency array
  // such that the function prop doesn't trigger the useEffect on each rerender.
  //
  ///////////////////////////////////////////////////////////////////////////

  const onColumnVisibilityChangeEvent = React.useEffectEvent((visibility: typeof columnVisibility) => {
    onColumnVisibilityChange?.(visibility)
  })

  React.useEffect(() => {
    if (firstRenderRef.current === true) {
      return
    }

    onColumnVisibilityChangeEvent(columnVisibility)
  }, [columnVisibility])

  /* ======================
        useEffect()  
  ====================== */
  // This useEffect() watches the showPagination prop.

  const setPageSize = tableInstance.setPageSize

  React.useEffect(() => {
    if (!enablePagination) {
      setPageSize(dataLength)
    } else {
      setPageSize(pageSizeProp)
    }
  }, [dataLength, pageSizeProp, enablePagination, setPageSize])

  /* ======================
        useEffect()
  ====================== */
  // This useEffect() watches for changes to rowSelection, then calls onSelectionChange.

  const onSelectionChangeEvent = React.useEffectEvent((selectedData: Record<any, any>[]) => {
    onSelectionChange?.(selectedData)
  })

  React.useEffect(() => {
    if (firstRenderRef.current === true) {
      return
    }

    const flatRows = tableInstance.getSelectedRowModel().flatRows
    const newSelectedData = flatRows.map((flatRow) => {
      return flatRow.original
    })

    onSelectionChangeEvent(newSelectedData)
  }, [tableInstance, rowSelection])

  /* ======================
        useEffect()
  ====================== */
  // This useEffect() will wipe the local rowSelection state.
  // Notice, however, that we don't explicitly call setRowSelection({}).
  // Instead, we call tableInstance.setRowSelection({}). This seems to
  // be more idiomatic.

  React.useEffect(() => {
    if (firstRenderRef.current === true) {
      return
    }

    if (enableRowSelection === false) {
      tableInstance.setRowSelection({})
    }
  }, [enableRowSelection, tableInstance])

  /* ======================
    useEffect() for apiRef
  ====================== */

  React.useEffect(() => {
    if (apiRef) {
      apiRef.current = tableInstance
    }
  }, [tableInstance]) // eslint-disable-line

  /* ======================
        useEffect()  
  ====================== */
  // This useEffect updates the firstRenderRef.
  // It should always be the LAST useEffect().

  React.useEffect(() => {
    if (firstRenderRef.current === true) {
      firstRenderRef.current = false
    }
  }, [])

  /* ======================
        renderTitle()
  ====================== */

  //# ...

  /* ======================
      renderControls()
  ====================== */
  //# Test responsiveness against different viewport sizes.

  const renderControls = () => {
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
              globalFilterProps.className
            )}
            globalFilter={globalFilter}
            setGlobalFilter={setGlobalFilter}
            disabled={disabled}
            enableGlobalFilter={enableGlobalFilter}
          />

          {enablePagination && (
            <Pagination
              disabled={disabled}
              pageSize={pageSizeProp}
              pageSizes={pageSizes}
              tableInstance={tableInstance}
              variant={variant}
            />
          )}
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

  /* ======================
    renderTableHeader()
  ====================== */

  const renderTableHeader = () => {
    return (
      <thead {...headProps}>
        {tableInstance.getHeaderGroups().map((headerGroup) => (
          <tr {...headRowProps} key={headerGroup.id}>
            {headerGroup.headers.map((header) => {
              const canSort = header.column.getCanSort()

              const columnFilter = (
                <ColumnFilter
                  {...columnFilterProps}
                  className={cn(
                    {
                      'mx-auto w-[calc(100%-4px)]': size === 'xs'
                      // '': size === 'sm'
                    },
                    columnFilterProps.className
                  )}
                  column={header.column}
                  disabled={disabled}
                />
              )

              // The enableColumnFilter is a property that exists in Tanstack Table.
              // However, by default it's true, which means you have to explicitly
              // opt out of the filtering if you don't want it. Moreover, there seems
              // to be no way to change the global default to false. I prefer to opt
              // in to column filtering. We can accomplish this by using our own enableFilter
              // variable here such that if it's not EXPLICITLY set to true, then we consider it false.
              const enableFilter = header?.column?.columnDef?.enableColumnFilter === true ? true : false

              ///////////////////////////////////////////////////////////////////////////
              //
              // Note: The Nikita Dev tutorial did this at 8:15
              //
              //   return (
              //     <th key={header.id} colSpan={header.colSpan}>
              //       {header.column.columnDef.header}
              //     </th>
              //   )
              //
              // However, I get this error:
              //
              //   ❌ Type 'ColumnDefTemplate<HeaderContext<unknown, unknown>> | undefined' is not assignable to type 'ReactNode'.
              //
              // In fact, the above approach will work if you're using string header values and not functions:
              //
              //    ❌  header: 'ID',
              //    ✅ header: () => <span>ID</span>
              //
              // However, as soon as one moves to the function syntax, the whole thing breaks
              // As TypeScript was trying to tell us, it's better to just use header.placeHolder + flexRender,
              // which is in fact the recommended approach for even a basic example:
              //
              //   https://tanstack.com/table/v8/docs/framework/react/examples/basic
              //
              // So... ANY TIME you think any of your column definitions might use the function version
              // of header, cell, or footer, then you want to be using flexRender. In other words, just
              // use flexRender within an <th> and <td> tags withing header the thead, tbody and tfoot.
              //
              ///////////////////////////////////////////////////////////////////////////

              return (
                <th
                  {...headCellProps}
                  className={cn('align-top', headCellProps.className)}
                  key={header.id}
                  colSpan={header.colSpan}
                  ///////////////////////////////////////////////////////////////////////////
                  //
                  // getSize() helps normalize the column widths. Sometimes it works better than the
                  // browser's algorithm, but sometimes not. It acts kind of like table-layout:fixed,
                  // but still provides the ability to shrink and grow as needed.
                  //
                  // getSize() is a hint fed into the content-based sizing algorithm. The browser uses it
                  // as a starting point but still measures actual cell content and will expand a column
                  // beyond your specified width if content demands it (and can also shrink/redistribute
                  // things if the table is constrained). That's the "normalizes but can still expand/contract"
                  // behavior you described earlier — accurate.
                  //
                  // Use enableGetSize prop to opt in.
                  //
                  // Also, now that we have this implemented, we can set the `size` property for a given
                  // column within our columns definition file.
                  //
                  ///////////////////////////////////////////////////////////////////////////

                  style={{
                    width: enableGetSize ? header.getSize() : undefined,
                    ...headCellProps.style
                  }}
                >
                  {header.isPlaceholder ? null : (
                    <div
                      className={cn(
                        header.column.getCanSort()
                          ? 'flex cursor-pointer items-center gap-2 select-none *:whitespace-nowrap'
                          : 'flex items-center gap-2 *:whitespace-nowrap',
                        disabled && 'pointer-events-none'
                      )}
                      onClick={disabled ? undefined : header.column.getToggleSortingHandler()}
                      title={
                        canSort
                          ? header.column.getNextSortingOrder() === 'asc'
                            ? 'Sort ascending'
                            : header.column.getNextSortingOrder() === 'desc'
                              ? 'Sort descending'
                              : 'Clear sort'
                          : undefined
                      }
                    >
                      {flexRender(header.column.columnDef.header, header.getContext())}

                      {{
                        asc: <MoveUp className='ml-auto size-4' />, // asc: <> 🔼</>,
                        desc: <MoveDown className='ml-auto size-4' /> // desc: <> 🔽</>
                      }[header.column.getIsSorted() as string] ??
                        (canSort ? <ArrowUpDown className='ml-auto size-4' /> : null)}
                    </div>
                  )}

                  {/* Conditionally render a column filter input. */}
                  {enableColumnFilters && enableFilter && header.column.getCanFilter() ? (
                    <div>{columnFilter}</div>
                  ) : null}
                </th>
              )
            })}
          </tr>
        ))}
      </thead>
    )
  }

  /* ======================
      renderTableBody()
  ====================== */

  const renderTableBody = () => {
    // If data is an empty array when &&  status is neither
    // 'pending' nor 'error', then show "No Data..."

    if (Array.isArray(data) && data.length === 0) {
      return (
        <tbody {...bodyProps}>
          <tr {...bodyRowProps}>
            <td
              colSpan={columns?.length || 1}
              className={cn(
                'py-8 text-center text-lg font-medium',
                !disabled && variant === 'primary' && 'text-primary',
                !disabled && variant === 'secondary' && 'text-secondary',
                disabled && 'text-(--table-disabled-color)'
              )}
            >
              No Data...
            </td>
          </tr>
        </tbody>
      )
    }

    return (
      <tbody {...bodyProps}>
        {tableInstance
          .getRowModel()
          .rows //.slice(0, 10) // Demo only!
          .map((row) => {
            const isSelected = row.getIsSelected()

            return (
              <tr
                {...bodyRowProps}
                className={cn(bodyRowProps.className, isSelected && highlightSelectedRows && 'table-active')}
                key={row.id}
              >
                {row.getVisibleCells().map((cell) => (
                  <td
                    {...bodyCellProps}
                    key={cell.id}
                    className={cn(
                      bodyCellProps.className,

                      disabled && 'text-(--table-disabled-color)'
                    )}
                    style={{
                      width: enableGetSize ? cell.column.getSize() : undefined,
                      ...bodyCellProps.style
                    }}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            )
          })}
      </tbody>
    )
  }

  /* ======================
    renderTableFooter()
  ====================== */

  const renderTableFooter = () => {
    // Return null when no footer is detected in the column definition, or
    // when the showFooter prop is set to false.
    if (!hasFooter || !showFooter) {
      return null
    }

    return (
      <tfoot {...footProps}>
        {tableInstance.getFooterGroups().map((footerGroup) => (
          <tr {...footRowProps} key={footerGroup.id}>
            {footerGroup.headers.map((header) => (
              <th
                {...footCellProps}
                key={header.id}
                className={cn(footCellProps.className)}
                colSpan={header.colSpan}
                style={{
                  width: enableGetSize ? header.getSize() : undefined,
                  ...footCellProps.style
                }}
              >
                {header.isPlaceholder ? null : flexRender(header.column.columnDef.footer, header.getContext())}
              </th>
            ))}
          </tr>
        ))}
      </tfoot>
    )
  }

  /* ======================
        renderTable()
  ====================== */
  //# Test/Review the No Columns Selected! UI / logic.

  const renderTable = () => {
    return (
      <TableContainer {...tableContainerProps} disabled={disabled} variant={variant}>
        {renderControls()}

        {atLeastOneVisibleColumn ? (
          <TableScrollContainer {...scrollContainerProps}>
            <table
              {...tableProps}
              className={cn(
                tableBaseClasses,
                bordered && 'table-bordered',
                borderless && !bordered && 'table-borderless',
                flush && 'table-flush',
                hover && 'table-hover',
                striped && 'table-striped',
                stripedColumns && 'table-striped-columns',
                { 'table-xs': size === 'xs', 'table-sm': size === 'sm' },

                !disabled && variant === 'primary' && 'shadcn-table-primary',
                !disabled && variant === 'secondary' && 'shadcn-table-secondary',
                disabled && 'shadcn-table-disabled',
                tableProps.className
              )}
            >
              {renderTableHeader()}
              {renderTableBody()}
              {renderTableFooter()}
            </table>
          </TableScrollContainer>
        ) : (
          <div className='py-6 text-center text-sm font-medium italic'>No Columns Selected!</div>
        )}
      </TableContainer>
    )
  }

  /* ======================
      renderContent()
  ====================== */
  // We may not want to include the status prop and associated error
  // and pending UI in a production version of Table.

  const renderContent = () => {
    if (status === 'error') {
      return (
        <Alert
          className={cn('mx-auto mb-6 max-w-150')}
          leftSection={<AlertCircle className='size-6' />}
          title='Error'
          variant='destructive'
        >
          Unable To Render Table Data
        </Alert>
      )
    }

    if (status === 'pending') {
      // Todo: Render Skeleton.
      return <div className='text-primary my-6 text-center text-3xl leading-none font-black'>Loading Table...</div>
    }

    // Checking for !data or !columns will never be true because we default to []
    // in each case. However, if you wanted you could check the length property of each.
    // The data.length case will be handled by injecting a custom row into the <tbody>.
    if (!data || !columns || columns.length === 0) {
      return (
        <Alert
          className={cn('mx-auto mb-6 max-w-150')}
          leftSection={<AlertCircle className='size-6' />}
          title='Error'
          variant='destructive'
        >
          Unable To Render Table - missing columns or data.
        </Alert>
      )
    }

    return renderTable()
  }

  /* ======================
          return
  ====================== */

  return renderContent()
}

export type { Column, TableProps, TableAPI, TableOptions }
