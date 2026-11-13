import * as React from 'react'
import {
  flexRender,
  getCoreRowModel,
  useReactTable
  // getFilteredRowModel,
  // SortingState,
  // getPaginationRowModel,
  // InitialTableState,
  // ColumnOrderState
} from '@tanstack/react-table'

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
///////////////////////////////////////////////////////////////////////////

export const Table = ({ apiRef, data, columns, status, shouldGetSize = true, tableOptions }: TableProps) => {
  // eslint-disable-next-line react-hooks/incompatible-library
  const tableInstance = useReactTable({
    data: data || [],
    columns: (columns || []) as Column[],
    getCoreRowModel: getCoreRowModel(),
    initialState: {},
    ...tableOptions
  })

  const { getHeaderGroups, getRowModel, getFooterGroups } = tableInstance

  // At 11:45 in the Nikita Dev tutorial he uses tableInstance?.getTotalSize() to set the size of the table.
  // <Box w={table.getTotalSize()}>. The fact that he's using Box is dumb, but I didn't know you can query
  // the table size or header.getSize() either. I did this little demo just to try it out.

  // React.useEffect(() => {
  //   if (status !== 'success') { return console.log('DOM calculations should not be executed until the table exists.') }
  //   const tableSize = tableInstance?.getTotalSize() // => 1200
  //   console.log({ tableSize })
  // }, [tableInstance, status])

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
                      // getSize() helps normalize the column widths better than the browser's algorithm.
                      // It acts kind of like table-layout:fixed, but still provides the ability to shrink
                      // and grow as needed.
                      //
                      // getSize() is a hint fed into the content-based sizing algorithm. The browser uses it
                      // as a starting point but still measures actual cell content and will expand a column
                      // beyond your specified width if content demands it (and can also shrink/redistribute
                      // things if the table is constrained). That's the "normalizes but can still expand/contract"
                      // behavior you described earlier — accurate.
                      //
                      // Adding the getSize() method to the table's default implementation seems like a sensible
                      // default, but it also means that it will overwrite any className you apply for width.
                      // Consequently, shouldGetSize prop is used to opt out.

                      //
                      // Also, now that we have this implemented, we can set the `size` property for a given
                      // column within our columns definition file.
                      //
                      ///////////////////////////////////////////////////////////////////////////

                      style={{
                        width: shouldGetSize ? header.getSize() : undefined
                      }}
                    >
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  )
                })}
              </tr>
            ))}
          </thead>

          <tbody>
            {getRowModel().rows.map((row) => (
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

      return <div className='my-6 text-center text-3xl leading-none font-black text-violet-800'>Loading...</div>
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
