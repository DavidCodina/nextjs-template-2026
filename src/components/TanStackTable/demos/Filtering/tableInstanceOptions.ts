import type { InitialTableState } from '@tanstack/react-table'

// https://tanstack.com/table/v8/docs/guide/column-sizing
export const defaultColumnSizing = {
  size: 150,
  minSize: 20,
  maxSize: Number.MAX_SAFE_INTEGER
}

export const sortingFns = {
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

export const initialState: InitialTableState = {}
