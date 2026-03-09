import { Suspense } from 'react'
// import { cacheLife } from 'next/cache'
import { AlertCircle } from 'lucide-react'
import { Alert, Spinner } from '@/components'
import { randomTrue, sleep } from '@/utils'

const getData = async () => {
  // 'use cache'
  await sleep(2000)

  const isTrue = randomTrue()

  return {
    code: 'OK',
    data: {
      test: isTrue ? 'You rock!' : 'You suck!'
    },
    message: 'success',
    success: true
  }
}

/* ========================================================================
              
======================================================================== */
///////////////////////////////////////////////////////////////////////////
//
// ⚠️ Gotcha: When cacheComponents:true is enabled, Next.js will no longer let
// you await data directly in the page.tsx file. The fetch must be abstracted
// into a separate server component.
//
// ❌ const result = await getData()
//
// Error: This delays the entire page from rendering, resulting in a slow user experience.
// Next.js uses this error to ensure your app loads instantly on every navigation.
// Learn more: https://nextjs.org/docs/messages/blocking-route
// To fix this, you can either:
//
//   - Wrap the component in a <Suspense> boundary. This allows Next.js to stream its contents
//     to the user as soon as it's ready, without blocking the rest of the app.
//
//   - Move the asynchronous await into a Cache Component ("use cache"). This allows Next.js
//     to statically prerender the component as part of the HTML document, so it's instantly visible to the user.
//
// In practice, there's actually a third alternative where you can instead mark the above getData function
// with "use cache"
//
///////////////////////////////////////////////////////////////////////////

const DataComponent = async () => {
  ///////////////////////////////////////////////////////////////////////////
  //
  // The 'use cache' approach will result in the following status at build time,
  // assuming  there's nothing else that may potential modify the associated page.tsx:
  //
  //   ○  (Static)   prerendered as static content
  //
  // In other words, if we're caching the child component, then this is essentially telling
  // Next.js that it's okay to make the page fully static.
  //
  ///////////////////////////////////////////////////////////////////////////

  // 'use cache'
  // cacheLife('minutes')
  const { data, success, message } = await getData()

  /* ======================

  ====================== */

  const renderContent = () => {
    if (success !== true) {
      return (
        <Alert
          leftSection={<AlertCircle className='size-6' />}
          // rightSection={<RetryButton>Retry</RetryButton>}
          title={'Error'}
          variant={'destructive'}
          className='mx-auto my-6 max-w-[800px] bg-rose-50/10'
        >
          {message}
        </Alert>
      )
    }

    if (success === true) {
      return (
        <pre className='bg-card mx-auto mb-6 max-w-[800px] overflow-scroll rounded-lg border p-4 shadow'>
          {JSON.stringify(data, null, 2)}
        </pre>
      )
    }

    return null
  }

  /* ======================
          return
  ====================== */

  return <>{renderContent()}</>
}

/* ========================================================================
              
======================================================================== */
///////////////////////////////////////////////////////////////////////////
//
// This approach will result in the following status at build time,assuming there's
// nothing else that may potential modify the associated page.tsx:
//
//   ◐  (Partial Prerender)  prerendered as static HTML with dynamic server-streamed content
//
// Then when you first go to the page, it will load with the spinner the first time.
// The actual content will change on every subsequent request for the associated page.
// In other words, the result is not cached and not statically locked into the page build.
//
///////////////////////////////////////////////////////////////////////////

const DataComponentWithSuspense = () => {
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
