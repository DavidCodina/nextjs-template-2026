import { Suspense } from 'react'
import { getDataAction } from './getDataAction'
import { Spinner } from '@/components'

/* ========================================================================

======================================================================== */

const DataComponent = async () => {
  const result = await getDataAction()

  return (
    <pre className='bg-card mx-auto max-w-[800px] overflow-scroll rounded-lg border p-4 shadow'>
      {JSON.stringify(result, null, 2)}
    </pre>
  )
}

const DataComponentWithSuspense = async () => {
  const fallback = (
    <div className='py-12'>
      <Spinner className='mx-auto block' size={50} />
    </div>
  )

  return (
    <Suspense fallback={fallback}>
      <DataComponent />
    </Suspense>
  )
}

export { DataComponentWithSuspense as DataComponent }
