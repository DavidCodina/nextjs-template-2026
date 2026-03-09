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

type GetDataReturnType = ReturnType<typeof getData>

/* ========================================================================

======================================================================== */

type SuspenseDataProps = {
  promise: GetDataReturnType
}

const SuspenseData = ({ promise }: SuspenseDataProps) => {
  const { data } = React.use(promise)
  const [mounted, setMounted] = React.useState(false)

  /* ======================
          useEffect()
  ====================== */
  // Don't render the JSX until the component is mounted.
  // This prevents a Next.js hydration mismatch error whereby
  // the JSX on the server executed version differs from the
  // JSX on the client rendered version.

  React.useLayoutEffect(() => {
    setMounted(true)
  }, [])

  /* ======================
          return
  ====================== */

  if (!promise || !mounted) {
    return null
  }

  return (
    <pre className='bg-card min-w-[200px] overflow-scroll rounded-lg border p-2 text-xs'>
      {JSON.stringify(data, null, 2)}
    </pre>
  )
}

/* ========================================================================

======================================================================== */

const WithSuspense = () => {
  const dataPromise = React.useMemo(() => {
    return getData()
  }, [])

  return (
    <React.Suspense fallback={<div className='text-primary text-center font-bold'>Loading Suspense Data...</div>}>
      <SuspenseData promise={dataPromise} />
    </React.Suspense>
  )
}

export { WithSuspense as SuspenseData }
