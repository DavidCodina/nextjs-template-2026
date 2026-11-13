export type TableVariant = 'primary' | 'secondary'

// Or use a sricter approach:
// type TableDataHeader = string[]
// type TableDataRow = string[]
// type TableDataBody = TableDataRow[]
// type TableDataFooter = string[]

type TableDataHeader = React.ReactNode[]
type TableDataRow = React.ReactNode[]
type TableDataBody = TableDataRow[]
type TableDataFooter = React.ReactNode[]

/** Used by DataTable. */
export type TableData = {
  header?: TableDataHeader
  body: TableDataBody
  footer?: TableDataFooter
}
