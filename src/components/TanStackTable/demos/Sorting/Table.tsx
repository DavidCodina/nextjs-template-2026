import * as React from 'react'
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable

  // getFilteredRowModel,
  // SortingState,
  // getPaginationRowModel,
  // InitialTableState,
  // ColumnOrderState
} from '@tanstack/react-table'

import { ArrowUpDown, MoveDown, MoveUp } from 'lucide-react'

import type { ColumnDef, TableOptions as Options, Table as TableInstance } from '@tanstack/react-table'

export type TableOptions = Options<Record<string, any>>
export type TableAPI = TableInstance<Record<string, any>>
export type Column = ColumnDef<Record<string, any>, any>
export type LooseColumn = Record<string, any>

// Type 'Record<string, any>[] | null' is not assignable to type 'ColumnDef<any, any>[]'.

type TableProps = {
  data?: Record<string, any>[] | null
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
  status: 'idle' | 'pending' | 'success' | 'error'
  apiRef?: React.RefObject<TableAPI | null>
  shouldGetSize?: boolean

  tableOptions?: TableOptions
}

// https://tanstack.com/table/v8/docs/guide/column-sizing
const defaultColumnSizing = {
  size: 150,
  minSize: 20,
  maxSize: Number.MAX_SAFE_INTEGER
}

const sortingFns = {
  ///////////////////////////////////////////////////////////////////////////
  //
  // https://tanstack.com/table/v8/docs/api/features/sorting#sorting-functions
  // This is the type signature for every sorting function:
  //
  //   export type SortingFn<TData extends AnyData> = {
  //     (rowA: Row<TData>, rowB: Row<TData>, columnId: string): number
  //   }
  //
  // sortByRawValue is used when the associated value has been transformed from an
  // ISO string to a formatted date, and that new value is being used as the
  // accessor. Why? would it be used as the accesor? Because then global and
  // column filtering will work as expected. However, we need to then fix the
  // sorting such that it uses the original ISO string value.
  //
  // This function will now be accessible from the column definition by
  // using the following property:
  //
  //  sortingFn: 'sortByRawValue' as any
  //
  // It's unlikely that we'll be sorting actual date objects, but if that's the
  // case, there's actually a built-in 'datetime' sorting function.
  //
  ///////////////////////////////////////////////////////////////////////////
  sortByRawValue: (rowA: any, rowB: any, columnId: any): number => {
    ///////////////////////////////////////////////////////////////////////////
    //
    // Strangely, both in the default sorting function and in this one it
    // begins with the desc for numbers, but asc for strings. Use this to change:
    //
    //  sortDescFirst: false
    //
    // It will still sort the values correctly (i.e, asc will still be lowest to highest, etc.).
    // It's just the order of the processes is different for different primitives.
    // This is definitely a tanstack table thing, and not coming from the implementation.
    // In any case, sortByRawValue will handle numbers and strings correctly.
    //
    // Where it will struggle is with stringified numbers such that '100' will be considered
    // lower than '20'. This is the expected behavior and also occurs within tanstack table's
    // default sorter. In cases where your data has numbers as string values, the best approach
    // is to probably transform them into numbers from within the accessor function.
    // However, another approach might be to have a specific sorter for them: sortStringAsNumber
    //
    ///////////////////////////////////////////////////////////////////////////
    const valueA = rowA.original[columnId]
    const valueB = rowB.original[columnId]

    // This is also a lexicographical sort:
    // valueA < valueB ? -1 : valueA > valueB ? 1 : 0
    return valueA < valueB ? -1 : 1
  },
  // Use this sorter when number values are stored as strings, but you want to sort them
  // as numbers. Alternatively, use the accessor to function to transform the function.
  sortStringAsNumber: (rowA: any, rowB: any, columnId: any): number => {
    // null values are treated as 0.
    // undefined values seem to break the ordering.
    // Basically, Number('') and Number(null) evaluate to 0,
    // but Number(undefined) evaluates to NaN as would Number('sadf').
    //
    // For this reason, I've added a failsafe that converts anything
    // that doesn't convert successfully to a number to 0.
    const isNum = (v: any): v is number => {
      return typeof v === 'number' && !isNaN(v)
    }

    const valueA = rowA.original[columnId]
    const valueB = rowB.original[columnId]

    let numberA: any = Number(valueA)
    let numberB: any = Number(valueB)

    if (!isNum(numberA)) {
      numberA = 0
    }

    if (!isNum(numberB)) {
      numberB = 0
    }

    return numberA < numberB ? -1 : 1
  }
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
///////////////////////////////////////////////////////////////////////////

export const Table = ({ apiRef, data, columns, status, shouldGetSize = false, tableOptions }: TableProps) => {
  // eslint-disable-next-line react-hooks/incompatible-library
  const tableInstance = useReactTable({
    data: data || [],
    columns: (columns || []) as Column[],
    defaultColumn: {
      ...defaultColumnSizing,
      ...tableOptions?.defaultColumn
      // We may choose to do this in production for all tables.
      // sortUndefined: 'last'
    },
    getCoreRowModel: getCoreRowModel(),
    initialState: {},
    getSortedRowModel: getSortedRowModel(), // client-side sorting,
    // onSortingChange: setSorting, // Optional: control sorting state in your own scope for easy access

    // The type defs define this as: sortingFns?: Record<string, SortingFn<any>>
    // However, if we add a custom sortingFn, it will work when used by a
    // column definition, but TypeScript seems not to recognize it.
    sortingFns: sortingFns,

    // state: { sorting },
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

  /* ======================
            API
  ====================== */

  React.useEffect(() => {
    if (apiRef) {
      apiRef.current = tableInstance
    }
  }, [tableInstance]) // eslint-disable-line

  /* ======================
      renderTable()
  ====================== */

  const renderTable = () => {
    return (
      <div
        className='shadcn-table-container shadcn-table-primary rounded-xl'
        // style={{ borderRadius: 15, WebkitOverflowScrolling: 'touch' }}
      >
        <table className='shadcn-table table-bordered table-hover table-striped bg-card table-flush'>
          <thead>
            {getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const canSort = header.column.getCanSort()
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
                      // Use shouldGetSize prop to opt in.
                      //
                      // Also, now that we have this implemented, we can set the `size` property for a given
                      // column within our columns definition file.
                      //
                      ///////////////////////////////////////////////////////////////////////////

                      style={{
                        width: shouldGetSize ? header.getSize() : undefined
                      }}
                    >
                      {/* {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext() )} */}

                      {header.isPlaceholder ? null : (
                        <div
                          className={
                            header.column.getCanSort()
                              ? 'flex cursor-pointer flex-wrap items-center select-none'
                              : 'flex flex-wrap items-center'
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
                    </th>
                  )
                })}
              </tr>
            ))}
          </thead>

          <tbody>
            {getRowModel()
              .rows //.slice(0, 10) //^ Demo only!
              .map((row) => (
                <tr key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      style={{
                        width: shouldGetSize ? cell.column.getSize() : undefined
                      }}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
          </tbody>

          {/* Obviously, we need conditional logic here for cases where
          There might not even be footer data.
          What would happen if we entirely removed footer data from the columns.
          It wouldn't error, but it would render an empty row. */}

          <tfoot>
            {getFooterGroups().map((footerGroup) => (
              <tr key={footerGroup.id}>
                {footerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    colSpan={header.colSpan}
                    style={{
                      width: shouldGetSize ? header.getSize() : undefined
                    }}
                  >
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.footer, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </tfoot>
        </table>
      </div>
    )
  }

  /* ======================
      renderContent()
  ====================== */

  const renderContent = () => {
    if (status === 'error') {
      // Todo:  Render <Alert />
      return null
    }

    if (status === 'pending') {
      // Todo: Render loading spinner, or skeleton.

      return <div className='text-primary my-6 text-center text-3xl leading-none font-black'>Loading...</div>
    }

    if (!data || !columns) {
      //# Return error Alert indicating that data or columns is not defined
      return null
    }

    return renderTable()
  }

  /* ======================
          return
  ====================== */

  return renderContent()
}
