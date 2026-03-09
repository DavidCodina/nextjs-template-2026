'use client'

import * as React from 'react'

/* ========================================================================

======================================================================== */

export const ClientComponent = ({ getDataPromise }: any) => {
  const res = React.use(getDataPromise)

  return (
    <pre className='bg-card mx-auto w-fit rounded-xl border border-neutral-400 p-4 text-sm shadow'>
      {JSON.stringify(res, null, 2)}
    </pre>
  )
}
