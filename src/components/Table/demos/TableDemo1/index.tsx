'use client'

import {
  Table,
  TableBody,
  // TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow
} from '../../.'

/* ========================================================================

======================================================================== */
// This example demonstrates manual composition of the Table.

export const TableDemo1 = () => {
  /* ======================
    renderDefaultTable()
  ====================== */
  const renderDefaultTable = () => {
    return (
      <Table
        className=''
        bordered
        // borderless
        // flush={false}
        hover
        // renderTableOnly
        // size='sm'
        striped
        // stripedColumns
        tableContainerClassName='max-w-[800px] mx-auto mt-12 rounded-lg shadow-[0_8px_30px_rgb(0,0,0,0.12)]'
        // tableContainerStyle={{ outline: '2px dashed deeppink' }}

        // variant='primary'
      >
        <TableHeader>
          <TableRow>
            <TableHead>Invoice</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Method</TableHead>
            <TableHead>Amount</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          <TableRow
          // className='table-group-divider'
          >
            <TableCell>INV001_1234567890_1234567890_1234567890_1234567890_1234567890</TableCell>
            <TableCell>Paid</TableCell>
            <TableCell>Credit Card</TableCell>
            <TableCell>$150.00</TableCell>
          </TableRow>

          <TableRow>
            <TableCell>INV002</TableCell>
            <TableCell>Paid</TableCell>
            <TableCell>Credit Card</TableCell>
            <TableCell>$250.00</TableCell>
          </TableRow>

          <TableRow>
            <TableCell>INV003</TableCell>
            <TableCell>Paid</TableCell>
            <TableCell>Credit Card</TableCell>
            <TableCell>$350.00</TableCell>
          </TableRow>

          <TableRow>
            <TableCell>INV004</TableCell>
            <TableCell>Paid</TableCell>
            <TableCell>Credit Card</TableCell>
            <TableCell>$450.00</TableCell>
          </TableRow>

          <TableRow>
            <TableCell>INV005</TableCell>
            <TableCell>Paid</TableCell>
            <TableCell>Credit Card</TableCell>
            <TableCell>$550.00</TableCell>
          </TableRow>
        </TableBody>

        <TableFooter>
          <TableRow>
            <TableHead>Invoice</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Method</TableHead>
            <TableHead>Amount</TableHead>
          </TableRow>
        </TableFooter>

        {/* TableCaption generally doesn't integrate well with TableContainer.
        If you insist on using it, you'll likely want to set renderTableOnly.
        
        <TableCaption className='text-left'>
          A list of your recent invoices.
        </TableCaption> 
        */}
      </Table>
    )
  }

  /* ======================
    renderPrimaryTable()
  ====================== */

  const renderPrimaryTable = () => {
    return (
      <Table
        className=''
        bordered
        hover
        striped
        // stripedColumns
        tableContainerClassName=' max-w-[800px] mx-auto mt-12 rounded-lg shadow-[0_8px_30px_rgb(0,0,0,0.12)]'
        variant='primary'
      >
        {/* <TableCaption>A list of your recent invoices.</TableCaption> */}
        <TableHeader>
          <TableRow>
            <TableHead>Invoice</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Method</TableHead>
            <TableHead>Amount</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          <TableRow
          //className='table-group-divider'
          >
            <TableCell>INV001</TableCell>
            <TableCell>Paid</TableCell>
            <TableCell>Credit Card</TableCell>
            <TableCell>$150.00</TableCell>
          </TableRow>

          <TableRow>
            <TableCell>INV002</TableCell>
            <TableCell>Paid</TableCell>
            <TableCell>Credit Card</TableCell>
            <TableCell>$250.00</TableCell>
          </TableRow>

          <TableRow>
            <TableCell>INV003</TableCell>
            <TableCell>Paid</TableCell>
            <TableCell>Credit Card</TableCell>
            <TableCell>$350.00</TableCell>
          </TableRow>

          <TableRow>
            <TableCell>INV004</TableCell>
            <TableCell>Paid</TableCell>
            <TableCell>Credit Card</TableCell>
            <TableCell>$450.00</TableCell>
          </TableRow>

          <TableRow>
            <TableCell>INV005</TableCell>
            <TableCell>Paid</TableCell>
            <TableCell>Credit Card</TableCell>
            <TableCell>$550.00</TableCell>
          </TableRow>
        </TableBody>

        <TableFooter>
          <TableRow>
            <TableHead>Invoice</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Method</TableHead>
            <TableHead>Amount</TableHead>
          </TableRow>
        </TableFooter>
      </Table>
    )
  }

  /* ======================
    renderSecondaryTable()
  ====================== */

  const renderSecondaryTable = () => {
    return (
      <Table
        className=''
        bordered
        hover
        striped
        // stripedColumns
        tableContainerClassName=' max-w-[800px] mx-auto mt-12 rounded-lg shadow-[0_8px_30px_rgb(0,0,0,0.12)]'
        variant='secondary'
      >
        {/* <TableCaption>A list of your recent invoices.</TableCaption> */}
        <TableHeader>
          <TableRow>
            <TableHead>Invoice</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Method</TableHead>
            <TableHead>Amount</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          <TableRow
          //className='table-group-divider'
          >
            <TableCell>INV001</TableCell>
            <TableCell>Paid</TableCell>
            <TableCell>Credit Card</TableCell>
            <TableCell>$150.00</TableCell>
          </TableRow>

          <TableRow>
            <TableCell>INV002</TableCell>
            <TableCell>Paid</TableCell>
            <TableCell>Credit Card</TableCell>
            <TableCell>$250.00</TableCell>
          </TableRow>

          <TableRow>
            <TableCell>INV003</TableCell>
            <TableCell>Paid</TableCell>
            <TableCell>Credit Card</TableCell>
            <TableCell>$350.00</TableCell>
          </TableRow>

          <TableRow>
            <TableCell>INV004</TableCell>
            <TableCell>Paid</TableCell>
            <TableCell>Credit Card</TableCell>
            <TableCell>$450.00</TableCell>
          </TableRow>

          <TableRow>
            <TableCell>INV005</TableCell>
            <TableCell>Paid</TableCell>
            <TableCell>Credit Card</TableCell>
            <TableCell>$550.00</TableCell>
          </TableRow>
        </TableBody>

        <TableFooter>
          <TableRow>
            <TableHead>Invoice</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Method</TableHead>
            <TableHead>Amount</TableHead>
          </TableRow>
        </TableFooter>
      </Table>
    )
  }

  /* ======================
          return
  ====================== */

  return (
    <>
      {renderDefaultTable()}

      {renderPrimaryTable()}

      {renderSecondaryTable()}
    </>
  )
}
