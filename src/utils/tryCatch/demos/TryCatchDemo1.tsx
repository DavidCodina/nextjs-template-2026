import * as React from 'react'
import { tryCatchAsync, tryCatchSync } from '../.'
import { Alert, Button } from '@/components'
import { randomFail, sleep } from '@/utils'

const getSyncData = () => {
  if (randomFail()) {
    throw new Error('Unable to get sync data.')
  }

  return {
    code: 'OK',
    data: { about: "I'm sync data!" },
    message: 'success',
    success: true
  }
}

/* ======================

====================== */

const getAsyncData = async () => {
  await sleep(1000)

  if (randomFail()) {
    throw new Error('Unable to get async data.')
  }

  return {
    code: 'OK',
    data: { about: "I'm async data!" },
    message: 'success',
    success: true
  }
}

/* ========================================================================

======================================================================== */
///////////////////////////////////////////////////////////////////////////
//
// Theo: ✅ https://www.youtube.com/watch?v=Y6jT-IkV0VM
//       ✅ https://gist.github.com/t3dotgg/a486c4ae66d32bf17c09c73609dacc5b
//
// G2I:  ✅ https://www.youtube.com/watch?v=VcOIz7tOBoM
//         At 11 minutes in he references NeverThrow.
//         https://wix-ux.com/when-life-gives-you-lemons-write-better-error-messages-46c5223e1a2f
//
// WDS:  ✅ https://www.youtube.com/watch?v=AdmGHwvgaVs
//       ✅ https://www.youtube.com/watch?v=ovnyeq-Xxrc
//          Most of the videos is just a lead up to referencing NeverThrow at 26 minutes in.
//
// See also:
//
//   https://github.com/supermacro/neverthrow
//   https://www.npmjs.com/package/@kreisler/try-catch
//
///////////////////////////////////////////////////////////////////////////

export const TryCatchDemo1 = () => {
  const [syncError, setSyncError] = React.useState('')
  const [asyncError, setAsyncError] = React.useState('')

  const [pending, setPending] = React.useState(false)
  const [syncData, setSyncData] = React.useState<Record<string, unknown> | null>(null)
  const [asyncData, setAsyncData] = React.useState<Record<string, unknown> | null>(null)

  /* ======================
    handleGetAsyncData()
  ====================== */

  const handleGetAsyncData = async () => {
    setSyncError('')
    setAsyncError('')
    setPending(true)
    setSyncData(null)
    setAsyncData(null)

    ///////////////////////////////////////////////////////////////////////////
    //
    // I undertand the need for tryCatch and tryCatchAsync. However, getAsyncData is
    // mocking an async data fetch without its own try/catch. Generally, I strongly
    // prefer to use try/catch directly within API helpers, rather than externalizing
    // the extra step of passing the API function into tryCatchAsync when consuming.
    // TL;DR: while tryCatch and tryCatchAsync are useful, I would generally not use them
    // for API calls. Where something like tryCatch starts to shine is when you're trying
    // to avoid nested try/catch blocks. However, in those cases we're not even necessarily
    // concerned with what the error is. We just want to know if we have data or null.
    //
    // Also, if you're using TS Query, then you'll likely not need tryCatchAsync either.
    // Why? Because Tanstack Query allready catches inside of useQuery().
    //
    ///////////////////////////////////////////////////////////////////////////

    const { data: asyncData, error } = await tryCatchAsync(getAsyncData())

    if (error) {
      setAsyncError(error.message)
    } else if (asyncData) {
      setAsyncData(asyncData)
    }

    setPending(false)
  }

  /* ======================
    handleGetSyncData()
  ====================== */

  const handleGetSyncData = async () => {
    setSyncError('')
    setAsyncError('')
    setSyncData(null)
    setAsyncData(null)

    const { data: syncData, error } = tryCatchSync(getSyncData)

    if (error) {
      setSyncError(error.message)
    } else if (syncData) {
      setSyncData(syncData)
    }
  }

  /* ======================
      renderSyncData()
  ====================== */

  const renderSyncData = () => {
    if (syncError) {
      return (
        <Alert className='mx-auto mb-6 max-w-125 dark:bg-(--destructive-soft)/15' title='Error' variant='destructive'>
          <p>{syncError}</p>
        </Alert>
      )
    }

    if (syncData) {
      return (
        <pre className='bg-card mx-auto mb-6 max-w-125 overflow-scroll rounded-lg border p-4 text-sm shadow'>
          {JSON.stringify(syncData, null, 2)}
        </pre>
      )
    }

    return null
  }

  /* ======================
      renderAsyncData()
  ====================== */

  const renderAsyncData = () => {
    if (asyncError) {
      return (
        <Alert className='mx-auto mb-6 max-w-125 dark:bg-(--destructive-soft)/15' title='Error' variant='destructive'>
          <p>{asyncError}</p>
        </Alert>
      )
    }

    if (pending) {
      return <div className='text-primary text-center text-3xl'>Pending...</div>
    }

    if (asyncData) {
      return (
        <pre className='bg-card mx-auto mb-6 max-w-125 overflow-scroll rounded-lg border p-4 text-sm shadow'>
          {JSON.stringify(asyncData, null, 2)}
        </pre>
      )
    }

    return null
  }

  /* ======================
          return
  ====================== */
  return (
    <div>
      <div className='mb-6 flex flex-wrap justify-center gap-4'>
        <Button className='min-w-37.5' onClick={handleGetSyncData} size='sm'>
          Get Sync Data
        </Button>

        <Button className='min-w-37.5' loading={pending} onClick={handleGetAsyncData} size='sm'>
          {pending ? 'Pending...' : 'Get Async Data'}
        </Button>
      </div>

      {renderSyncData()}
      {renderAsyncData()}
    </div>
  )
}
