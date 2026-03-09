import { Suspense } from 'react'
import { getDataAction } from './getDataAction'
import { ClientComponent } from './ClientComponent'

/* ========================================================================

======================================================================== */
// See the following lecture by Aurora Scharff at 12:30:
// React Server Components Elevating Speed, Interactivity, and User Experience - Aurora Scharff
// https://www.youtube.com/watch?v=dA-8FY5xlbk&t=1478s
export const ServerComponentDemo = async () => {
  const getDataPromise = getDataAction()

  return (
    <Suspense fallback={<div className='text-primary text-center text-2xl font-bold'>Loading...</div>}>
      <ClientComponent getDataPromise={getDataPromise} />
    </Suspense>
  )
}
