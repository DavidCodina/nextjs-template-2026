import { useEffect, useRef, useState } from 'react'
import { Button } from '../../../Button'

import data from '../data.json'
import { columns as cols } from './columns'

import { Table } from './Table'
import type { TableAPI } from './Table'

import { useCycle } from '@/hooks'
import { sleep } from '@/utils'

const getData = async () => {
  try {
    await sleep(1000)
    return {
      data: data,
      success: true,
      message: 'Success.'
    }
  } catch (_err) {
    return {
      data: null,
      success: false,
      message: 'Server error.'
    }
  }
}

/* ========================================================================

======================================================================== */
//////////////////////////////////////////////////////////////////////////
//
//  Basic examples from the docs memoize data.
//  In practice the data will be coming from an API, or hardcoded in a separate file,
//  then passed in as a prop. Presumably, this means that there's no need to memoize the data. Why?
//  Because we're not internally defining a data constant anew each time the component renrenders.
//
/////////////////////////
//
//  https://react-table.tanstack.com/docs/quick-start
//  It's important that we're using React.useMemo here to ensure that our data isn't recreated
//  on every render. If we didn't use React.useMemo, the table would think it was receiving
//  new data on every render and attempt to recalculate a lot of logic every single time. Not cool!
//
//  I think that only applies if COLUMNS are defined inside of the component.
//  In that case it makes sense that every rerender would rebuild the columns
//  Nonetheless, it doesn't hurt to memoize it.
//
//  Yeah... If you define columns inside of the component, then don't memoize them,
//  it will cause an infinite loop and crash the App. Either memoize them:
//
//    const cols = useMemo(() => columns, []);
//
//  Or:
//
//    const columns = useMemo(() => grouped_columns, []);
//
//
//  Or define columns outside of the component.
//
//////////////////////////////////////////////////////////////////////////

export const CSVExample1 = () => {
  /* ======================
       state & refs
  ====================== */

  // apiRef.current will hold the value of the TableInstance, which can be useful
  // for working with the table from the consuming side.
  const apiRef = useRef<TableAPI>(null)
  const [data, setData] = useState<Record<string, any>[] | null>(null)
  const [columns, setColumns] = useState<Record<string, any>[] | null>(null)
  const [status, setStatus] = useState<'idle' | 'pending' | 'success' | 'error'>('pending')

  const [enableGlobalFilter, setEnableGlobalFilter] = useState(true)
  const [enablePagination, setEnablePagination] = useState(true)
  const [enableColumns, setEnableColumns] = useState(true)
  const [showControls, setShowControls] = useState(true)
  const [showFooter, setShowFooter] = useState(true)
  const [disabled, setDisabled] = useState(false)

  const [columnVisibility, setColumnVisibility] = useState<Record<string, boolean>>({ table_row_select: false })

  const [enableRowSelection, setEnableRowSelection] = useState(true)
  const [selection, setSelection] = useState<Record<string, boolean>[] | null>(null)

  const [columnOrder, setColumnOrder] = useState<string[]>([])

  const [variant, runVariantCycle] = useCycle(undefined, 'primary', 'secondary')

  const [showExportCSVButton, setShowExportCSVButton] = useState(true)

  /* ======================
      toggleRowSelect() 
  ====================== */

  const toggleRowSelect = () => {
    setColumnVisibility((prev) => {
      // The select property could be omitted, which means it is true,
      // assuming onSelectionChange prop has been passed in, thereby
      // enabling the feature.
      if (prev.row_select === true) {
        return {
          ...prev,
          row_select: false
        }
      }
      return {
        ...prev,
        row_select: true
      }
    })
  }

  /* ======================
     toggleColumnOrder() 
  ====================== */

  const toggleColumnOrder = () => {
    if (columnOrder.length === 0) {
      // An arbitrary ordering for demo purposes.
      // Unknown elements are ignored. Unlisted elements fallback
      // to their default order at the end of the list.
      setColumnOrder(['row_select', 'id', 'age', 'abc123', 'email'])
    } else {
      setColumnOrder([])
    }
  }

  /* ======================
         useEffect()
  ====================== */
  // This useEffect demonstrates that Table can render,
  // and useReactTable() can update asynchronously.

  useEffect(() => {
    setStatus('pending')
    getData()
      .then((result) => {
        const { success, data } = result

        if (success === true && Array.isArray(data)) {
          setData(data)
          setColumns(cols) // groupedColumns | manualGroupedColumns
          setStatus('success')
        } else {
          setStatus('error')
        }

        return result
      })
      .catch((err) => {
        setStatus('error')
        return err
      })
  }, [])

  /* ======================
         useEffect()
  ====================== */

  useEffect(() => {
    console.log('Selected data:', selection)
  }, [selection])

  /* ======================
         useEffect()
  ====================== */

  // useEffect(() => {
  //   if (!apiRef.current) return
  //   console.log(apiRef.current)
  // }, [status])

  /* ======================
      renderControls()
  ====================== */

  const renderControls = () => {
    return (
      <div
        // Note: auto-fit (i.e., not auto-fill) works much better when
        // using justify-center. Why? Because we don't want ghost columns.
        className={`mx-auto mb-6 grid max-w-232.5 grid-cols-[repeat(auto-fit,minmax(150px,1fr))] justify-center gap-2`}
      >
        <Button
          onClick={() => {
            setDisabled((v) => !v)
          }}
          size='xs'
          variant='cyan'
        >
          {!disabled ? 'Disable Table' : 'Enable Table'}
        </Button>
        <Button
          onClick={() => {
            setEnableRowSelection((v) => !v)
          }}
          size='xs'
          variant='cyan'
        >
          {enableRowSelection === false ? 'Enable Row Selection' : 'Disable Row Selection'}
        </Button>

        <Button onClick={() => runVariantCycle(undefined)} size='xs' variant='cyan'>
          {variant === 'primary' ? 'Primary Vriant' : variant === 'secondary' ? 'Secondary Variant' : 'Default Variant'}
        </Button>

        <Button
          onClick={() => {
            // In the case of toggling the select column, we do actually need to do it more carefully.
            toggleRowSelect()
          }}
          size='xs'
          variant='cyan'
        >
          {columnVisibility.row_select === false ? 'Add Row Selection' : 'Remove Row Selection'}
        </Button>

        <Button
          onClick={() => {
            setColumnVisibility((prev) => {
              const isId = prev.id !== false
              return { ...prev, id: !isId }
            })
          }}
          size='xs'
          variant='cyan'
        >
          {columnVisibility.id === false ? 'Add id' : 'Remove id'}
        </Button>

        <Button
          onClick={() => {
            toggleColumnOrder()
          }}
          size='xs'
          variant='cyan'
        >
          {columnOrder.length !== 0 ? 'Custom Column Order' : 'Default Column Order'}
        </Button>

        <Button
          onClick={() => {
            setShowControls((v) => !v)
          }}
          size='xs'
          variant='cyan'
        >
          {showControls ? 'Hide Controls' : 'Show Controls'}
        </Button>

        <Button
          onClick={() => {
            setEnableGlobalFilter((v) => !v)
          }}
          size='xs'
          variant='cyan'
        >
          {enableGlobalFilter ? 'Disable Filter' : 'Enable Filter'}
        </Button>
        <Button
          onClick={() => {
            setEnablePagination((v) => !v)
          }}
          size='xs'
          variant='cyan'
        >
          {enablePagination ? 'Disable Pagination' : 'Enable Pagination'}
        </Button>

        <Button
          onClick={() => {
            setEnableColumns((v) => !v)
          }}
          size='xs'
          variant='cyan'
        >
          {enableColumns ? 'Disable Columns' : 'Enable Columns'}
        </Button>

        <Button
          onClick={() => {
            setShowFooter((v) => !v)
          }}
          size='xs'
          variant='cyan'
        >
          {showFooter ? 'Hide Footer' : 'Show Footer'}
        </Button>

        <Button
          onClick={() => {
            setShowExportCSVButton((v) => !v)
          }}
          size='xs'
          variant='cyan'
        >
          {showExportCSVButton ? 'Hide CSV' : 'Show CSV'}
        </Button>
      </div>
    )
  }

  /* ======================
          return
  ====================== */

  return (
    <>
      {renderControls()}

      <Table
        highlightSelectedRows={true}
        enableRowSelection={enableRowSelection}
        onSelectionChange={(selectedData: Record<any, any>[]) => {
          setSelection(selectedData)
        }}
        disabled={disabled}
        apiRef={apiRef}
        data={data}
        columns={columns}
        // columnOrder is an optional prop that allows the consumer to
        // dynamically modify the default order of the columns. It works
        // on mount, and anytime thereafter. columnOrder is never set from
        // within, so there's no need to have a callback prop like
        // to update the external state.
        columnOrder={columnOrder}
        enableColumnSelection={enableColumns}
        // columnVisibility is an optional prop that allows the consumer to
        // dynamically modify the default visibility of the columns. It works
        // on mount, and anytime thereafter.
        columnVisibility={columnVisibility}
        // If one is controlling visibility externally AND also showing the built-in
        // visibility check UI, then it's best to also pass in an onColumnVisibilityChange
        // callback. That way if the internal visibility state changes, we can pass
        // it back to the consuming environment, so the two states remain in sync.
        onColumnVisibilityChange={(newColumnVisibility) => {
          setColumnVisibility(newColumnVisibility)
        }}
        status={status}
        striped
        // stripedColumns
        hover
        // borderless
        bordered
        size='sm'
        variant={variant as undefined | 'primary' | 'secondary'}
        enableGlobalFilter={enableGlobalFilter}
        enablePagination={enablePagination}
        // enableColumnFilters={false}
        // enableGetSize
        showControls={showControls}
        tableContainerProps={{
          className: 'mx-auto max-w-[1000px] shadow'
        }}
        scrollContainerProps={{}}
        tableProps={{}}
        headProps={{}}
        headRowProps={{}}
        headCellProps={{}}
        bodyProps={{}}
        bodyRowProps={{}}
        bodyCellProps={{}}
        footProps={{}}
        footRowProps={{}}
        footCellProps={{}}
        globalFilterProps={{}}
        columnFilterProps={{}}
        tableOptions={{}}
        showFooter={showFooter}
        showExportCSVButton={showExportCSVButton}
        csvExportFileName='my-csv-export'
        // https://github.com/react-csv/react-csv#nested-json-data
        // Passing in csvHeaders allows you to limit what fields are exported.
        // It also allows you to relabel the properties when being exported.
        csvHeaders={[
          { label: 'id', key: 'id' },
          { label: 'First Name', key: 'first_name' },
          { label: 'Last Name', key: 'last_name' }
        ]}
        exportCSVButtonProps={
          {
            // className: 'outline-2 outline-dashed outline-pink-500'
          }
        }

        //# Test this
        // pageIndex={1}
        // pageSize={5}

        //# Implement and test this and/or remove.
        // title={titleInfo?.title}
        // subtitle={titleInfo?.subtitle}
        // titleContainerClassName=''
        // titleContainerStyle={{ textAlign: 'center' }}
        // titleClassName='outline-strong outline-sky outline-width-1 outline-shadow'
        // titleStyle={{ fontSize: 28 }}
        // subtitleClassName=''
        // subtitleStyle={{ color: '#409' }}
      />
    </>
  )
}
