import { cacheTag } from 'next/cache'
import { AlertCircle } from 'lucide-react'
import { Alert, UpdateTagButton } from '@/components'
import { getTime } from './getTime'

export const PRIVATE_TIME_TAG = 'PRIVATE_TIME_TAG'

/* ========================================================================

======================================================================== */

export const PrivateComponentDemo = async () => {
  'use cache: private'
  cacheTag(PRIVATE_TIME_TAG)

  // ⚠️ Gotcha. Test the build not dev. Why?
  // Next.js only prefetches automatically in production.

  const { data, message, success } = await getTime()

  /* ======================
        renderTime()
  ====================== */

  const renderContent = () => {
    if (success !== true) {
      return (
        <Alert
          leftSection={<AlertCircle className='size-6' />}
          // Having a retry button is crucial to prevent indefinitely
          // caching the error. Moreover, unlike TanStack Query, it's not
          // going to automatically do a background refetch. You'll end
          // up getting stuck with it.
          rightSection={
            <UpdateTagButton tag={PRIVATE_TIME_TAG} size='sm' variant='destructive'>
              Retry
            </UpdateTagButton>
          }
          title={'Error'}
          variant={'destructive'}
          className='mx-auto my-6 max-w-200'
        >
          {message}
        </Alert>
      )
    }

    if (success === true && data && typeof data === 'string') {
      return <div className='text-primary my-6 text-center text-3xl font-bold'>{data}</div>
    }

    return null
  }

  /* ======================
          return
  ====================== */

  return (
    <div className='mx-auto max-w-200'>
      <div className='flex justify-center gap-4'>
        <UpdateTagButton className='min-w-30' shouldLog={true} tag={PRIVATE_TIME_TAG} size='sm'>
          Purge Time
        </UpdateTagButton>
      </div>

      {renderContent()}
    </div>
  )
}
