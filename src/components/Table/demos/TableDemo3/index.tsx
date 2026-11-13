'use client'
import * as React from 'react'

import { DataTable } from '../../.'
import { getPosts } from './getPosts'

import type { TableData } from '../.././types'

/* ========================================================================

======================================================================== */
///////////////////////////////////////////////////////////////////////////
//
// This example demonstrates an API-driven implementation of DataTable.
// DataTable's data property must be of type TableData. However, TypeScript
// will not enforce this during runtime, so it's up to the developer to prepare
// (i.e., transform/convert) the API response as needed.
//
// The original specification referenced omdbapi.com as an example API. However,
// the actual API is abritrary, and for demonstration, it's easier to use APIs
// that don't require API keys.
//
///////////////////////////////////////////////////////////////////////////

//# Create separate app and push to GitHub.

//# Fix menu

//# Fix theme to white.

export const TableDemo3 = () => {
  const [data, setData] = React.useState<TableData | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState('')

  /* ======================
      handleGetPosts()()
  ====================== */

  const handleGetPosts = () => {
    setLoading(true)
    setError('')
    getPosts()
      .then((result) => {
        const { /* code, */ data, /* message, */ success } = result

        if (success === true && data !== null) {
          // Transform data into type TableData as needed.
          const header = ['Id', 'Title', 'Body']
          const body = data.map((item) => [item.id, item.title, item.body])
          const footer = ['Id', 'Title', 'Body']
          setData({ header, body, footer })
        } else if (success === false) {
          setError('Unable to get data.')
        }

        return result
      })
      .catch((_err) => {
        setError('Unable to get data.')
      })
      .finally(() => {
        setLoading(false)
      })
  }

  /* ======================
        useEffect()
  ====================== */

  React.useEffect(() => {
    handleGetPosts()
  }, [])

  /* ======================
      renderDataTable
  ====================== */

  const renderDataTable = () => {
    if (error) {
      // Uncomment randomFail() in getPosts.ts to see error UI.
      // Return an <Alert> with a "Try Again" button.
      return (
        <div className='mx-auto mb-6 max-w-125 rounded-lg border border-rose-500 bg-rose-500/20 px-2 py-2 font-semibold text-rose-500 shadow'>
          {error}
        </div>
      )
    }

    if (loading) {
      // Return a Spinner or Skeleton
      return <div className='text-primary text-center text-3xl font-bold'>Loading...</div>
    }

    if (data) {
      return (
        <DataTable
          data={data}
          loading={loading}
          tableProps={{
            bordered: true,
            hover: true,
            striped: true,
            tableContainerClassName: 'max-w-[1000px] mx-auto mt-12 rounded-lg shadow-[0_8px_30px_rgb(0,0,0,0.12)]'
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

    return null
  }

  /* ======================
          return
  ====================== */

  return <>{renderDataTable()}</>
}
