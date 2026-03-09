'use client'

import { Suspense } from 'react'
import { DataWithUse } from './DataWithUse'
import { DataWithUseProps } from './types'

/* ========================================================================
                  
======================================================================== */

const DataWithUseAndSuspense = (props: DataWithUseProps) => {
  return (
    <>
      {/* ⚠️ The ErrorBoundary logic should also be here IF you have an ErrorBoundary. 
      However, for the purpose of the demonstration, it's still on the parent. */}
      <Suspense
        // Obviously, this is bad because it will create cumulative layout shift, so don't do
        // this in production.
        fallback={<h3 className='mb-6 text-center text-2xl leading-none font-black text-violet-800'>Loading...</h3>}
      >
        <DataWithUse {...props} />
      </Suspense>
    </>
  )
}

export { DataWithUseAndSuspense as DataWithUse }
