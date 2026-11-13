import { format } from 'date-fns'
// https://tanstack.com/table/v8/docs/api/core/column-def
// https://tanstack.com/table/v8/docs/guide/column-defs

import { createColumnHelper } from '@tanstack/react-table'
import { BooleanCell, NumberInputCell, SelectCell, TextInputCell } from '../../'

// Rather than being overly confident that all properties will exist on each Person
// it's much safer to make everything optional ? so that we don't inadvertently
// crash the app if we try perform an operation against a value that doesn't exist.
type Person = {
  id?: number
  first_name?: string
  last_name?: string | null
  email?: string
  date_of_birth?: string
  age?: number
  country?: string
  phone?: string
  is_cool?: boolean
}

const columnHelper = createColumnHelper<Person>()

/* ========================================================================

======================================================================== */

export const columns = [
  columnHelper.accessor('id', {
    cell: (ctx) => ctx.getValue(),
    header: () => <span>ID</span>,
    footer: (ctx) => ctx.column.id,
    ///////////////////////////////////////////////////////////////////////////
    //
    // Used to conditionally set styles in
    // header <th> className with header.column.getCanSort()
    // This also seems to influence whether the click handler works:
    //
    //   onClick={header.column.getToggleSortingHandler()}
    //
    ///////////////////////////////////////////////////////////////////////////
    enableSorting: false,
    // meta.label will be used internally by ColumnSelection's renderColumnCheckboxes() for
    // each associated Checkbox label. If no meta.label is provided, it will fall back to
    // the column.id.
    meta: { label: 'ID' }
  }),

  columnHelper.accessor('first_name', {
    // cell: (ctx) => ctx.getValue(),
    // When implementing InputCell, make sure to pass setData prop to the TanStackTable instance.
    cell: (ctx) => {
      return <TextInputCell context={ctx} />
    },
    header: () => <span>First Name</span>,
    footer: (ctx) => ctx.column.id,
    sortUndefined: 'last', // Force undefined values to the end
    enableColumnFilter: true,
    meta: { label: 'First Name' }
  }),

  columnHelper.accessor('last_name', {
    cell: (ctx) => {
      const value = ctx.getValue()

      return value
    },
    header: () => <span>Last Name</span>,
    footer: (ctx) => ctx.column.id,
    sortUndefined: 'last',
    enableColumnFilter: true,
    meta: { label: 'Last Name' }
  }),

  ///////////////////////////////////////////////////////////////////////////
  //
  // Given the following:
  //
  //   columnHelper.accessor('date_of_birth', {
  //     cell: (info) => {
  //       const value = info.getValue()       // => ISO 8601 string
  //       const formatString = 'MMMM d, yyyy' // 'dd/MM/yyyy'
  //       return value ? format(new Date(value), formatString) : '-'
  //     },
  //     header: () => <span>Date of Birth</span>,
  //     footer: (info) => info.column.id,
  //     sortUndefined: 'last',
  //     // Use filterFn that converts raw value to formatted value the
  //     // same as cell function does. The only issue here is that the
  //     // global filter will still be filtering against the raw/orignal value.
  //     filterFn: (row, id, filterValue) => {
  //       const value: string = row.getValue(id)
  //       if (typeof value !== 'string') {
  //         return false
  //       }
  //       const formatString = 'MMMM d, yyyy' // 'dd/MM/yyyy'
  //       const formattedValue = format(new Date(value), formatString)
  //       return formattedValue.toLowerCase().includes(filterValue.toLowerCase())
  //     }
  //   }),
  //
  // By default the auto sorting function will be alphanumeric in this case.
  // https://github.com/TanStack/table/blob/main/packages/table-core/src/sortingFns.ts
  //
  //  function toString(a: any) {
  //     if (typeof a === 'number') {
  //       if (isNaN(a) || a === Infinity || a === -Infinity) {
  //         return ''
  //       }
  //       return String(a)
  //     }
  //     if (typeof a === 'string') { return a }
  //     return ''
  //   }
  //
  //   const alphanumeric: SortingFn<any> = (rowA, rowB, columnId) => {
  //     return compareAlphanumeric(
  //       toString(rowA.getValue(columnId)).toLowerCase(),
  //       toString(rowB.getValue(columnId)).toLowerCase()
  //     )
  //   }
  //
  // In other words, even though the original value is a string, it will NOT be text().
  // As far as I can tell, alphanumeric() seems to do a decent job at sorting.
  // That said, I haven't tested it at the level of times. It may break down at
  // that point.
  //
  // In any case, The "datetime" sorting type is intended for Date objects,
  // but it can also handle ISO 8601 date strings. So... If you're not going
  // to change the value through the accessor function, you should probably use:
  //
  // sortingFn: 'datetime'
  //
  // However, we want 'date_of_birth' to ultimately be filterd against the formatted
  // value, so we need to move the formatting into the accessor function.
  // Again, the main reason for this is so the global filter will filter against
  // the formatted value. But this will also result in the sorting algorithm sorting
  // against the formatted value, so we now need to correct for this by explicitly
  // specifying a sortingFn that uses the orignal value.
  //
  ///////////////////////////////////////////////////////////////////////////
  columnHelper.accessor(
    (row) => {
      const value = row.date_of_birth
      const formatString = 'MMMM d, yyyy' // 'dd/MM/yyyy'
      return value && typeof value === 'string' ? format(new Date(value), formatString) : '-'
    },
    {
      id: 'date_of_birth',
      header: () => <span>Date of Birth</span>,
      footer: (ctx) => ctx.column.id,
      sortUndefined: 'last',
      enableColumnFilter: true,
      ///////////////////////////////////////////////////////////////////////////
      //
      // TypeScript will complain if you don't give it a built-in sortingFn.
      // https://tanstack.com/table/v8/docs/api/features/sorting
      // The docs indicate that: the final list of sorting functions
      // available for the columnDef.sortingFn use the following type:
      //
      // export type SortingFnOption<TData extends AnyData> =
      //   | 'auto'
      //   | SortingFns
      //   | BuiltInSortingFns
      //   | SortingFn<TData>
      //
      // I'm not sure if there's anything that can currently be done for this
      // other than setting it to `any`. There's not really a way that TypeScript
      // COULD automatically know what the custom sorters are. This data gets
      // passed in to the table instance at the same time as the sortingFn does.
      //
      // ISO 8601 date strings are designed for lexicographical sorting:
      //
      //   sortingFn: (rowA, rowB, columnId) => {
      //     const valueA = rowA.original[columnId as keyof Person]
      //     const valueB = rowB.original[columnId as keyof Person]
      //     return valueA < valueB ? -1 : valueA > valueB ? 1 : 0
      //   }
      //
      // However, sort byRawValue is also a lexicographical sort, but uses: return valueA < valueB ? -1 : 1
      // 'datetime' itself uses:  return a > b ? 1  : a < b ? -1 : 0 which is essentially the same
      // as the sorringFn above. However, everything I've read indicates that return valueA < valueB ? -1 : 1
      // works equally well. This means we can just use 'sortByRawValue'
      //
      ///////////////////////////////////////////////////////////////////////////
      sortingFn: 'sortByRawValue' as any,
      meta: { label: 'Date of Birth' }
    }
  ),

  columnHelper.accessor('country', {
    // cell: (ctx) => ctx.getValue(),

    cell: (ctx) => {
      // Note: Even though <option>'s value can be a number, it's always coerced to a string.
      // by the time it is acccessed as e.target. value. For this reason, SelectCell should
      // ONLY be used in conjunction with columns that expect string values.
      return (
        <SelectCell context={ctx}>
          <option value='United States'>United States</option>
          <option value='Canada'>Canada</option>
          <option value='Mexico'>Mexico</option>
        </SelectCell>
      )
    },

    header: () => <span>Country</span>,
    footer: (ctx) => ctx.column.id,
    sortUndefined: 'last',
    meta: {
      label: 'Country'
    }
  }),

  columnHelper.accessor('phone', {
    cell: (ctx) => ctx.getValue(),
    header: () => <span>Phone</span>,
    footer: (ctx) => ctx.column.id,
    sortUndefined: 'last',
    meta: { label: 'Phone' }
  }),

  columnHelper.accessor('email', {
    cell: (info) => info.getValue(),
    header: () => <span>Email</span>,
    footer: (info) => info.column.id,
    sortUndefined: 'last',
    meta: { label: 'Email' }
  }),

  columnHelper.accessor('age', {
    // cell: (ctx) => {
    //   const value = ctx.getValue() // type number
    //   return value
    // },

    cell: (ctx) => {
      return <NumberInputCell context={ctx} noNegative noDecimal />
    },

    header: () => <span>Age</span>,
    footer: (ctx) => ctx.column.id,
    sortUndefined: 'last',
    ///////////////////////////////////////////////////////////////////////////
    //
    // Inverting the sort order might be useful in some cases.
    // However, it wouldn't make sense in this case.
    // invertSorting: true
    //
    // Another option is to begin a sort with ascending instead of descending order.
    // This is actually useful because there's some inconsistency in which direction is
    // used first. For example, strings sort by ascending first, but numbers sort by
    // descending first. In this case, I want age to also sort by ascending first.
    //
    ///////////////////////////////////////////////////////////////////////////
    sortDescFirst: false, // First sort order will be ascending (nullable values can mess up auto detection of sort order)
    enableColumnFilter: true,

    ///////////////////////////////////////////////////////////////////////////
    //
    // When the value is a number, Tanstack Table seems to use a different filtering function.
    //
    //   useEffect(() => {
    //     const logAutoFilterFns = () => {
    //       if (!tableInstance || typeof tableInstance.getAllColumns !== 'function') { return }
    //       const allColumns = tableInstance?.getAllColumns()
    //       if (!Array.isArray(allColumns)) { return }
    //       allColumns.forEach((column) => {
    //         if (column && 'id' in column && 'getAutoFilterFn' in column) {
    //           console.log('\n\n')
    //           console.log(`${column?.id}:`)
    //           console.dir(column?.getAutoFilterFn())
    //         }
    //       })
    //    }
    //     logAutoFilterFns()
    //   })
    //
    // By default numbers will use inNumberRange:
    //
    //   var inNumberRange = (row, columnId, filterValue) => {
    //     let [min2, max2] = filterValue;
    //     const rowValue = row.getValue(columnId);
    //     return rowValue >= min2 && rowValue <= max2;
    //   };
    //
    // While strings will use includesString:
    //
    //   var includesString = (row, columnId, filterValue) => {
    //     var _row$getValue;
    //     const search = filterValue.toLowerCase();
    //     return Boolean((_row$getValue = row.getValue(columnId)) == null || (_row$getValue = _row$getValue.toString()) == null || (_row$getValue = _row$getValue.toLowerCase()) == null ? void 0 : _row$getValue.includes(search));
    //   };
    //
    // In order to get the column filter working with numeric values, we can do a few things:
    //
    //   1.  Use the includesString filter function.
    //   2. Use the custom 'fuzzy' filter function.
    //   3. Create our own custom filterFn here, inline.
    //
    ///////////////////////////////////////////////////////////////////////////
    filterFn: 'includesString', // 'fuzzy'
    // filterFn: (row, id, filterValue) => {
    //   const value: number = row.getValue(id)
    //   if (typeof value !== 'number') { return false }
    //   const valueAsString = value.toString()
    //   return valueAsString.includes(filterValue)
    // }
    meta: {
      label: 'Age'
    }
  }),

  // By coincidence, 'false' comes before 'true' when sorting alphabetically.
  // This aligns with the notion that false is 0 and 1 is true, and one 0 comes before 1.
  // For that reaon, the default sorting algorithm will still work as expected here.
  // Thus, unlike ISO date formatting, booleans do not need to implement:
  // sortingFn: 'sortByRawValue' as any

  // columnHelper.accessor(
  //   (row) => {
  //     const value = row.is_cool
  //     return typeof value === 'boolean' ? value.toString() : '-'
  //   },
  //   {
  //     id: 'is_cool',
  //     header: () => <span>Is Cool</span>,
  //     footer: (ctx) => ctx.column.id,
  //     enableColumnFilter: true,
  //     meta: { label: 'Is Cool' }
  //   }
  // )

  columnHelper.accessor('is_cool', {
    // cell: (ctx) => ctx.getValue(),
    cell: (ctx) => {
      return <BooleanCell context={ctx} />
    },
    header: () => <span>Is Cool</span>,
    footer: (ctx) => ctx.column.id,
    enableColumnFilter: true,
    meta: { label: 'Is Cool' }
  })
]
