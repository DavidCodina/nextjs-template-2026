import { format } from 'date-fns'
// https://tanstack.com/table/v8/docs/api/core/column-def
// https://tanstack.com/table/v8/docs/guide/column-defs

import { createColumnHelper } from '@tanstack/react-table'
import type { ColumnDef } from '@tanstack/react-table'

// Here we're being very confident that all properties will exist on each Person
// because we actually have the data hardcoded in a file. However, if you're getting
// the data from a database, it's much safer to make everything optional ? so that
// we don't inadvertently crash the app if we try perform an operation against a value
// that doesn't exist.
type Person = {
  id: number
  first_name: string
  last_name: string
  email: string
  date_of_birth: string
  age: number
  country: string
  phone: string
  is_cool: boolean
}

const columnHelper = createColumnHelper<Person>()

const _formatDate = (
  date: Date,
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat#options
  options: Intl.DateTimeFormatOptions = {
    year: 'numeric', // "numeric" | "2-digit" | undefined
    month: 'long', //  "numeric" | "2-digit" | "long" | "short" | "narrow" | undefined'
    day: 'numeric', // 'numeric' | '2-digit' | undeined
    weekday: 'long', // "long" | "short" | "narrow" | undefined'
    hour: 'numeric', // "numeric" | "2-digit" | undefined
    minute: '2-digit', // '"numeric" | "2-digit" | undefined
    // second: '2-digit', // '"numeric" | "2-digit" | undefined
    // dayPeriod: 'long' // "long" | "short" | "narrow" | undefined
    timeZone: 'UTC'
    // Using timeZoneName makes it more confusing.
    // timeZoneName: 'short' // "short" | "long" | "shortOffset" | "longOffset" | "shortGeneric" | "longGeneric" | undefined
  }
) => {
  if (!(date instanceof Date) || isNaN(Date.parse(date.toISOString()))) {
    return
  }
  return date.toLocaleDateString('en-US', options)
}

/* ========================================================================

======================================================================== */

export const columns = [
  columnHelper.accessor('id', {
    cell: (ctx) => ctx.getValue(),
    header: () => <span>ID</span>,
    //header: 'ID',
    footer: (ctx) => ctx.column.id,
    //# Bonus Nikita Dev creates a resizer bar at 12:30
    //# https://www.youtube.com/watch?v=CjqG277Hmgg
    //# He uses header.column.getIsResizing(), header.getResizeHandler(), columnResizeMode:"onChange"
    size: 25 // can also set minSize and maxSize
  }),

  columnHelper.accessor('first_name', {
    cell: (ctx) => ctx.getValue(),
    header: () => <span>First Name</span>,
    // header: 'First Name',
    footer: (ctx) => ctx.column.id
  }),

  columnHelper.accessor('last_name', {
    cell: (ctx) => ctx.getValue(),
    header: () => <span>Last Name</span>,
    // header: 'Last Name',
    footer: (ctx) => ctx.column.id
  }),

  ///////////////////////////////////////////////////////////////////////////
  //
  // It seems like there's some flexibility in regard to where we execute transformations.
  // For example, we could do this with a custom formatting function:
  //
  //   columnHelper.accessor('date_of_birth', {
  //     cell: (ctx) => {
  //       const value = ctx.getValue()
  //       const date = new Date(value)
  //       const formatted = formatDate(date)
  //       return formatted || ''
  //     },
  //     header: () => <span>Date of Birth</span>,
  //     // header: 'Date of Birth',
  //     footer: (ctx) => ctx.column.id
  //   }),
  //
  // However, I believe there's a hidden gotcha when it then comes to sorting.
  // Ideally, we want to be sorting against the original value and not the
  // transformed value.
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
      footer: (ctx) => ctx.column.id
    }
  )

  // columnHelper.accessor('country', {
  //   cell: (ctx) => ctx.getValue(),
  //   header: () => <span>Country</span>,
  //   // header: 'Country',
  //   footer: (ctx) => ctx.column.id
  // }),

  // columnHelper.accessor('phone', {
  //   cell: (ctx) => ctx.getValue(),
  //   header: () => <span>Phone</span>,
  //   // header: 'Phone',
  //   footer: (ctx) => ctx.column.id
  // }),

  // columnHelper.accessor('email', {
  //   cell: (ctx) => ctx.getValue(),
  //   header: () => <span>Email</span>,
  //   // header: 'Email',
  //   footer: (ctx) => ctx.column.id
  // }),

  // columnHelper.accessor('age', {
  //   cell: (ctx) => ctx.getValue(),
  //   header: () => <span>Age</span>,
  //   // header: 'Age',
  //   footer: (ctx) => ctx.column.id
  // })
]

/* ========================================================================

======================================================================== */
// When columns are built inside of a component the docs do this:
// const columns = React.useMemo<ColumnDef<Person, any>[]>(() => [ /* ... */], [])

export const manualColumns: ColumnDef<Person, any>[] = [
  {
    // This is the object key for the value that we want to output in <td> / 'Cell'
    // It corresponds to object property names in MOCK_DATA.
    accessorKey: 'id',
    header: 'Id',
    footer: 'Id'

    //# Here we could add cell
    //# Try this out...
    //# cell: (props) => <span>{props.getValue()}</span>
  },
  {
    accessorKey: 'first_name',
    header: 'First Name',
    footer: 'First Name'
  },
  {
    accessorKey: 'last_name',
    header: 'Last Name',
    footer: 'Last Name'
  },
  {
    accessorKey: 'date_of_birth',
    header: 'Date of Birth',
    footer: 'Date of Birth'
  },
  {
    accessorKey: 'country',
    header: 'Country',
    footer: 'Country'
  },
  {
    accessorKey: 'phone',
    header: 'Phone',
    footer: 'Phone'
  },
  {
    accessorKey: 'email',
    header: 'Email',
    footer: 'Email'
  },
  {
    accessorKey: 'age',
    header: 'Age',
    footer: 'Age'
  }
]

/* ========================================================================

======================================================================== */
// Grouped columns was demoed in video 5:
// https://www.youtube.com/watch?v=n4vgItNB_ac&list=PLC3y8-rFHvwgWTSrDiwmUsl4ZvipOw9Cz&index=5

export const groupedColumns = [
  columnHelper.accessor('id', {
    cell: (ctx) => ctx.getValue(),
    header: () => <span>ID</span>,
    footer: () => <span>ID</span>
  }),

  columnHelper.group({
    id: 'name-group',
    header: () => <span>Name</span>,
    footer: () => <span>Name</span>,

    columns: [
      columnHelper.accessor('first_name', {
        cell: (ctx) => ctx.getValue(),
        header: () => <span>First Name</span>,
        footer: () => <span>First Name</span>
      }),

      columnHelper.accessor('last_name', {
        cell: (ctx) => ctx.getValue(),
        header: () => <span>Last Name</span>,
        footer: () => <span>Last Name</span>
      })
    ]
  }),

  columnHelper.group({
    id: 'info-group',
    header: () => <span>Info</span>,
    footer: () => <span>Info</span>,

    columns: [
      columnHelper.accessor('date_of_birth', {
        cell: (ctx) => ctx.getValue(),
        header: () => <span>Date of Birth</span>,
        footer: () => <span>Date of Birth</span>
      }),

      columnHelper.accessor('country', {
        cell: (ctx) => ctx.getValue(),
        header: () => <span>Country</span>,
        footer: () => <span>Country</span>
      }),

      columnHelper.accessor('phone', {
        cell: (ctx) => ctx.getValue(),
        header: () => <span>Phone</span>,
        footer: () => <span>Phone</span>
      })
    ]
  })
]

export const manualGroupedColumns = [
  {
    accessorKey: 'id',
    header: 'Id',
    footer: 'Id'
  },

  {
    header: 'Name',
    footer: 'Name',
    columns: [
      {
        accessorKey: 'first_name',
        header: 'First Name',
        footer: 'First Name'
      },
      { accessorKey: 'last_name', header: 'Last Name', footer: 'Last Name' }
    ]
  },

  {
    header: 'Info',
    footer: 'Info',
    columns: [
      {
        accessorKey: 'date_of_birth',
        header: 'Date of Birth',
        footer: 'Date of Birth'
      },
      { accessorKey: 'country', header: 'Country', footer: 'Country' },
      { accessorKey: 'phone', header: 'Phone', footer: 'Phone' }
    ]
  }
]
