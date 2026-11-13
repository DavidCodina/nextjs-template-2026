import { flexRender } from '@tanstack/react-table'
import { ArrowUpDown, MoveDown, MoveUp } from 'lucide-react'
import { ColumnFilter } from './ColumnFilter'

import type { Table as TableInstance } from '@tanstack/react-table'
import type { ColumnFilterProps, THProps, THeadProps, TRProps } from '../types'

import { cn } from '@/utils'

export type TableHeaderProps = {
  columnFilterProps: Omit<ColumnFilterProps, 'column'>
  disabled: boolean
  enableColumnFilters: boolean
  enableGetSize: boolean
  headCellProps: THProps
  headProps: THeadProps
  headRowProps: TRProps
  size?: 'xs' | 'sm' | undefined
  tableInstance: TableInstance<Record<string, any>>
}

/* ========================================================================

======================================================================== */

export const TableHeader = ({
  columnFilterProps,
  disabled,
  enableColumnFilters,
  enableGetSize,
  headCellProps,
  headProps,
  headRowProps,
  size,
  tableInstance
}: TableHeaderProps) => {
  /* ======================
          return 
  ====================== */

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
                {enableColumnFilters && enableFilter && header.column.getCanFilter() ? <div>{columnFilter}</div> : null}
              </th>
            )
          })}
        </tr>
      ))}
    </thead>
  )
}
