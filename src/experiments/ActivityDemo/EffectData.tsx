'use client'

import * as React from 'react'
import { sleep } from '@/utils'

const getData = async () => {
  await sleep(2000)

  return {
    code: 'OK',
    data: { test: 'Testing...' },
    message: 'success',
    success: true
  }
}

/* ========================================================================

======================================================================== */
// In this case the EffectData component will NOT fetch the data until it is visible at least once.
// After that the data will persist in state. The point here is that the useEffect won't run when
// hidden.

export const EffectData = () => {
  const [data, setData] = React.useState<Record<string, any> | null>(null)
  React.useEffect(() => {
    if (data) {
      return
    }
    console.log('useEffect() triggered in <EffectData />')
    getData()
      .then((json) => {
        const { data: responseData, success } = json
        if (success) {
          setData(responseData)
        }
        return json
      })
      .catch((err) => err)
  }, [data])

  return (
    <>
      {data ? (
        <pre className='bg-card min-w-[200px] overflow-scroll rounded-lg border p-2 text-xs'>
          {JSON.stringify(data, null, 2)}
        </pre>
      ) : (
        <div className='text-primary text-center font-bold'>Loading Effect Data...</div>
      )}
    </>
  )
}
