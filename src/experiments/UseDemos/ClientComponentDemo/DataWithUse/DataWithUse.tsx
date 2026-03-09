'use client'

import { use } from 'react'
import { AlertCircle } from 'lucide-react'
import { Alert, Button } from '@/components'

import { isPromise } from '@/utils'

import { DataWithUseProps } from './types'

/* ========================================================================
                  
======================================================================== */

export const DataWithUse = ({ onRetry, promise, shouldFetch }: DataWithUseProps) => {
  if (!isPromise(promise) || !shouldFetch) {
    // Or you could throw an error, and let the ErrorBoundary handle it.
    // throw new Error("That's not a Promise!")
    return null
  }

  ///////////////////////////////////////////////////////////////////////////
  //
  // ⚠️ Gotcha: use() in React is designed to work within the Suspense paradigm.
  // You can't call it inside of a try/catch to handle errors.
  //
  //   ❌ `use` was called from inside a try/catch block. This is not allowed and
  //   can lead to unexpected behavior. To handle errors triggered by `use`, wrap your
  //   component in a error boundary.
  //
  //   try {
  //     const res = use(promise)
  //     return <pre>{JSON.stringify(res.data, null, 2)}</pre>
  //   } catch (_err) {
  //     return <Alert> ... </Alert>
  //   }
  //
  // One can instead wrap the Suspense in an ErrorBoundary when consuming the component.
  // However, that's super tedious to do on every for every <Suspense>. An alternative
  // solution is to implement a try/catch in the async function that makes the async request.
  // For example, the getData() function will catch errors internally, so we're guaranteed to
  // never get an error back from: const res = use(promise). This is the cleanest approach.
  //
  ///////////////////////////////////////////////////////////////////////////

  const res = use(promise)

  if (res.success !== true) {
    return (
      <Alert
        className='mx-auto mb-6 max-w-[600px]'
        leftSection={<AlertCircle className='size-6' />}
        rightSection={
          typeof onRetry == 'function' && (
            <Button
              className='min-w-[100px] self-center'
              onClick={() => {
                onRetry()
              }}
              size='sm'
              variant='destructive'
            >
              Retry
            </Button>
          )
        }
        title='Error'
        variant='destructive'
      >
        {typeof res?.message === 'string' ? res.message : 'Unable to get data!'}
      </Alert>
    )
  }

  return (
    <pre className='mx-auto mb-6 max-w-[800px] overflow-x-auto rounded-lg border border-neutral-400 bg-white p-4 shadow'>
      {JSON.stringify(res.data, null, 2)}
    </pre>
  )
}
