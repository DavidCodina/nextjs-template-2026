import { useEffect, useRef, useState } from 'react'
import { Button } from '../../../Button'

import data from '../data.json'
import {
  columns as cols
  // manualColumns as cols
  // groupedColumns,
  // manualGroupedColumns
} from './columns'

import { Table } from './Table'
import type { TableAPI } from './Table'

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

export const PaginationExample1 = () => {
  /* ======================
       state  & refs
  ====================== */

  // apiRef.current will hold the value of the TableInstance, which can be useful
  // for working with the table from the consuming side.
  const apiRef = useRef<TableAPI>(null)
  const [data, setData] = useState<Record<string, any>[] | null>(null)
  const [columns, setColumns] = useState<Record<string, any>[] | null>(null)
  const [status, setStatus] = useState<'idle' | 'pending' | 'success' | 'error'>('pending')

  const [enableGlobalFilter, setEnableGlobalFilter] = useState(true)
  const [enablePagination, setEnablePagination] = useState(true)
  const [showControls, setShowControls] = useState(true)
  const [showFooter, setShowFooter] = useState(true)

  const [disabled, setDisabled] = useState(false)

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

  // useEffect(() => {
  //   if (!apiRef.current) return
  //   console.log(apiRef.current)
  // }, [status])

  /* ======================
          return
  ====================== */

  return (
    <>
      <div className='mb-6 flex flex-wrap justify-center gap-2'>
        <Button
          className='min-w-37.5'
          onClick={() => {
            setDisabled((v) => !v)
          }}
          size='xs'
          variant='cyan'
        >
          {!disabled ? 'Disable Table' : 'Enable Table'}
        </Button>

        <Button
          className='min-w-37.5'
          onClick={() => {
            setShowControls((v) => !v)
          }}
          size='xs'
          variant='cyan'
        >
          {showControls ? 'Hide Controls' : 'Show Controls'}
        </Button>

        <Button
          className='min-w-37.5'
          onClick={() => {
            setEnableGlobalFilter((v) => !v)
          }}
          size='xs'
          variant='cyan'
        >
          {enableGlobalFilter ? 'Disable Filter' : 'Enable Filter'}
        </Button>
        <Button
          className='min-w-37.5'
          onClick={() => {
            setEnablePagination((v) => !v)
          }}
          size='xs'
          variant='cyan'
        >
          {enablePagination ? 'Disable Pagination' : 'Enable Pagination'}
        </Button>

        <Button
          className='min-w-37.5'
          onClick={() => {
            setShowFooter((v) => !v)
          }}
          size='xs'
          variant='cyan'
        >
          {showFooter ? 'Hide Footer' : 'Show Footer'}
        </Button>
      </div>

      <Table
        disabled={disabled}
        apiRef={apiRef}
        data={data}
        columns={columns}
        status={status}
        striped
        // stripedColumns
        hover
        // borderless
        bordered
        size='sm'
        variant='secondary'
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
        //# Test this
        showFooter={showFooter}

        //# Test this
        // showPagination={true} //# Change to enablePagination
        // showControls={true}
        // pageIndex={1}
        // pageSize={5}

        //# Test this
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
