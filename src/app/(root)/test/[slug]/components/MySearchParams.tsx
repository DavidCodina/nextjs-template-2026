'use client'

import * as React from 'react'
import { useSearchParams } from 'next/navigation'
import { searchParamsToObject } from '@/utils'

/* ========================================================================

======================================================================== */

const MySearchParams = () => {
  ///////////////////////////////////////////////////////////////////////////
  //
  // ⚠️ When implementing useSearchParams(), it's generally recommended to wrap in Suspense.
  //
  //   - In development, routes are rendered on-demand, so useSearchParams doesn't suspend and
  //     things may appear to work without Suspense.
  //
  //   - During production builds, a static page that calls useSearchParams from a Client Component
  //     must be wrapped in a Suspense boundary, otherwise the build fails with the Missing Suspense
  //     boundary with useSearchParams error.
  //
  // https://nextjs.org/docs/app/api-reference/functions/use-search-params#behavior
  //
  ///////////////////////////////////////////////////////////////////////////

  const searchParams = useSearchParams()
  const paramsObject = searchParamsToObject(searchParams)

  /* ======================
          return
  ====================== */

  return (
    <pre>
      <code>{JSON.stringify(paramsObject, null, 2)}</code>
    </pre>
  )
}

const MySearchParamsWithSuspense = () => {
  return (
    <React.Suspense>
      <MySearchParams />
    </React.Suspense>
  )
}

export { MySearchParamsWithSuspense as MySearchParams }
