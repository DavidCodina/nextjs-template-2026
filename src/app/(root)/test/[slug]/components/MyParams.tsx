'use client'

import * as React from 'react'
import { useParams } from 'next/navigation'

/* ========================================================================

======================================================================== */

const MyParams = () => {
  ///////////////////////////////////////////////////////////////////////////
  //
  // https://nextjs.org/docs/app/api-reference/functions/use-params#cache-components
  // ⚠️ When cacheComponents is enabled, useParams may require a Suspense boundary.
  // This depends on whether the params can be resolved during prerendering.
  //
  //   ❌ Error: Route "/test/[slug]": Next.js encountered URL data `useParams()` in a Client Component outside of `<Suspense>`.
  //      This blocks prerendering because the value is only available at runtime. Ways to fix this:
  //
  //     - [stream] Wrap the component in `<Suspense fallback={...}>` so the hook value streams in after prerendering
  //     - [block] Set `export const instant = false` to allow a blocking route
  //
  // So... The newer fix is to set  export const instant = false on the top level page.tsx.
  // However, let's assume we don't know how/where this component will be used. In that case,
  // we can simply wrap it here (i.e., use MyParamsWithSuspense)
  //
  ///////////////////////////////////////////////////////////////////////////

  const params = useParams<{ slug: string }>()

  /* ======================
          return
  ====================== */

  return (
    <pre className='bg-card mx-auto w-fit overflow-x-auto rounded-lg border p-4 text-sm'>
      <code>{JSON.stringify(params, null, 2)}</code>
    </pre>
  )
}

const MyParamsWithSuspense = () => {
  return (
    <React.Suspense>
      <MyParams />
    </React.Suspense>
  )
}

export { MyParamsWithSuspense as MyParams }
