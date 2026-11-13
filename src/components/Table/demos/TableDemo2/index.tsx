'use client'

import { DataTable } from '../../.'
import { testData } from './testData'

/* ========================================================================

======================================================================== */
// This example demonstrates a more data-driven approach. It consumes
// DataTable, which is an abstraction built on top of the Table component.
// testData is hardcoded in a file. Note: TableDemo3 shows an API-driven example.

export const TableDemo2 = () => {
  return (
    <DataTable
      data={testData}
      tableProps={{
        bordered: true,
        hover: true,
        striped: true,
        tableContainerClassName: 'max-w-200 mx-auto mt-12 rounded-lg shadow-[0_8px_30px_rgb(0,0,0,0.12)]'
      }}
      tableHeaderProps={{}}
      tableRowProps={{}}
      tableHeadProps={{}}
      tableBodyProps={{}}
      tableCellProps={{}}
      tableFooterProps={{}}
    />
  )
}
