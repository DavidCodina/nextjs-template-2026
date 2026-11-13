import * as React from 'react'
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable
  // FilterFn,
  // getFilteredRowModel,
  // getPaginationRowModel,
  // InitialTableState,
} from '@tanstack/react-table'

// import { RankingInfo } from '@tanstack/match-sorter-utils'

import { AlertCircle, ArrowUpDown, MoveDown, MoveUp } from 'lucide-react'

import { Alert } from '../../../Alert'

import { defaultColumnSizing, initialState, sortingFns } from './tableInstanceOptions'

import { fuzzyFilter } from './filters'
import { ColumnFilter } from './ColumnFilter'
import { GlobalFilter } from './GlobalFilter'

import type { ColumnFiltersState, SortingState } from '@tanstack/react-table'
import type { Column, TableAPI, TableOptions, TableProps } from './types'

import { cn } from '@/utils'

// No need to explicitly set a background color.
// The shadcn-table class does this: background-color: var(--table-bg),
// which itself refers to --color-card
const tableBaseClasses = `shadcn-table`

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
  data,
  enableColumnFilters, // Don't set default here!
  enableGetSize = false,
  enableGlobalFilter, // Don't set default here!
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

  tableContainerProps = {},
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
  columnFilterProps = {}
}: TableProps) => {
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

  /* ======================
        state & refs
  ====================== */

  const [globalFilter, setGlobalFilter] = React.useState('')
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [sorting, setSorting] = React.useState<SortingState>([])

  /* ======================
        Derived State
  ====================== */

  // Check the first column to see if it has a footer property.
  // If so, we can assume that all columns have a footer property.
  const firstColumn = Array.isArray(columns) && columns[0] ? columns[0] : {}

  // Used to determine if a footer <th> should be created when building selectableColumn.
  // Also used as part of conditional statement that determines whether or not to render <tfoot>.
  const hasFooter = firstColumn.hasOwnProperty('footer')

  /* ======================
      Memoize Columns 
  ====================== */
  // We can't assume that columns has been memoized, has been stored in state, or
  // is being imported from a static file. For that reason, we still need to wrap
  // it in useMemo() before passing it into the table instance.

  const cols = React.useMemo(() => {
    return columns
  }, [columns])

  /* ======================
    Table  Initialization
  ====================== */

  // eslint-disable-next-line react-hooks/incompatible-library
  const tableInstance = useReactTable({
    enableGlobalFilter: enableGlobalFilter,
    enableColumnFilters: enableColumnFilters,
    data: data || [],
    columns: (cols || []) as Column[],
    defaultColumn: {
      ...defaultColumnSizing,
      ...tableOptions?.defaultColumn
      // We may choose to do this in production for all tables.
      // sortUndefined: 'last'
    },

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

    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(), // client-side sorting,
    getFilteredRowModel: getFilteredRowModel(), // client side filtering
    globalFilterFn: 'includesString', // 'fuzzy', // Apply fuzzy filter to the global filter (most common use case for fuzzy filter),

    // The type defs define this as: sortingFns?: Record<string, SortingFn<any>>
    // However, if we add a custom sortingFn, it will work when used by a
    // column definition, but TypeScript seems not to recognize it.
    sortingFns: sortingFns,

    state: {
      columnFilters,
      globalFilter,
      sorting
    },

    // https://tanstack.com/table/v8/docs/api/core/table#initialstate
    initialState: initialState,

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

  // access sorting state from the table instance
  // console.log(tableInstance.getState().sorting)

  const { getHeaderGroups, getRowModel, getFooterGroups } = tableInstance

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
            API
  ====================== */

  React.useEffect(() => {
    if (apiRef) {
      apiRef.current = tableInstance
    }
  }, [tableInstance]) // eslint-disable-line

  /* ======================
    renderGlobalFilter()
  ====================== */

  const renderGlobalFilter = () => {
    if (!enableGlobalFilter) return null

    const globalFilterComponent = (
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
      />
    )

    return (
      <div className={cn('bg-card sticky border-b border-(--table-border-color) p-3')}>{globalFilterComponent}</div>
    )
  }

  const _renderGlobalFilterInHead = () => {
    if (!enableGlobalFilter) return null

    const globalFilterComponent = (
      <GlobalFilter {...globalFilterProps} globalFilter={globalFilter} setGlobalFilter={setGlobalFilter} />
    )

    if (columns && columns.length > 0) {
      return (
        <tr>
          <td style={{ border: 'none' }} colSpan={columns.length}>
            {globalFilterComponent}
          </td>
        </tr>
      )
    }

    return null
  }

  /* ======================
    renderTableHeader()
  ====================== */

  const renderTableHeader = () => {
    return (
      <thead {...headProps}>
        {getHeaderGroups().map((headerGroup) => (
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
                  {/* {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext() )} */}

                  {header.isPlaceholder ? null : (
                    <div
                      className={
                        header.column.getCanSort()
                          ? 'flex cursor-pointer items-center gap-2 select-none *:whitespace-nowrap'
                          : 'flex items-center gap-2 *:whitespace-nowrap'
                      }
                      onClick={header.column.getToggleSortingHandler()}
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
              className={cn('py-8 text-center text-lg font-medium', {
                'text-primary': variant === 'primary',
                'text-secondary': variant === 'secondary'
              })}
            >
              No Data...
            </td>
          </tr>
        </tbody>
      )
    }

    return (
      <tbody {...bodyProps}>
        {getRowModel()
          .rows //.slice(0, 10) //^ Demo only!
          .map((row) => (
            <tr {...bodyRowProps} key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td
                  {...bodyCellProps}
                  key={cell.id}
                  style={{
                    width: enableGetSize ? cell.column.getSize() : undefined,
                    ...bodyCellProps.style
                  }}
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
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
        {getFooterGroups().map((footerGroup) => (
          <tr {...footRowProps} key={footerGroup.id}>
            {footerGroup.headers.map((header) => (
              <th
                {...footCellProps}
                key={header.id}
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

  const renderTable = () => {
    return (
      <div
        {...tableContainerProps}
        className={cn(
          'shadcn-table-container rounded-xl',

          {
            '[--table-border-color:var(--color-primary)]': variant === 'primary',
            '[--table-border-color:var(--color-secondary)]': variant === 'secondary'
          },
          tableContainerProps.className
        )}
        // style={{ borderRadius: 15, WebkitOverflowScrolling: 'touch' }}
      >
        {renderGlobalFilter()}
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
            {
              'shadcn-table-primary': variant === 'primary',
              'shadcn-table-secondary': variant === 'secondary'
            },
            tableProps.className
          )}
        >
          {renderTableHeader()}
          {renderTableBody()}
          {renderTableFooter()}
        </table>
      </div>
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
      // Todo: Render skeleton.
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

    return <>{renderTable()}</>
  }

  /* ======================
          return
  ====================== */

  return renderContent()
}

export type { Column, TableProps, TableAPI, TableOptions }
