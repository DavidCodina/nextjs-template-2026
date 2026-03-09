'use client'

import { Suspense } from 'react'
import { Data } from './Data'
import { DataProps } from './types'

/* ========================================================================
                  
======================================================================== */

const DataWithSuspense = (props: DataProps) => {
  return (
    <Suspense
      // Obviously, this is bad because it will create cumulative layout shift,
      // so don't do this in production.
      fallback={<h3 className='mb-6 text-center text-2xl leading-none font-black text-violet-800'>Loading...</h3>}
    >
      <Data {...props} />
    </Suspense>
  )
}

export { DataWithSuspense as Data }
