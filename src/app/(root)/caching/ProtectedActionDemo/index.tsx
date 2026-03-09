'use client'

import * as React from 'react'
import { toast } from 'sonner'

import { Button, UpdateTagButton } from '@/components'
import { getTimeAction } from './getTimeAction'

/* ========================================================================

======================================================================== */

export const ProtectedActionDemo = () => {
  const [time, setTime] = React.useState('')
  const [pending, setPending] = React.useState(false)

  /* ======================
        handleGetTime()
  ====================== */

  const handleGetTime = async () => {
    setPending(true)

    try {
      const { data, success } = await getTimeAction()

      if (success !== true) {
        toast.error('Unable to get protected data')
        return
      }

      if (success === true && data) {
        setTime(data)
        toast.success('Success.')
        return
      }
    } catch {
      toast.error('Unable to get protected data')
    } finally {
      setPending(false)
    }
  }

  /* ======================
        renderTime()
  ====================== */

  const renderTime = () => {
    if (pending && !time) {
      return <div className='text-primary my-6 text-center text-3xl font-black'>Loading...</div>
    }

    if (time) {
      return <div className='text-primary my-6 text-center text-3xl font-bold'>{time}</div>
    }

    return null
  }

  /* ======================
          return
  ====================== */

  return (
    <div className='mx-auto max-w-200'>
      <p className='mb-6'>
        In this example the <span className='font-bold'>Purge Time</span> button calls the{' '}
        <code className='text-pink-500'>updateTagAction</code>. It will not immediately clear the time from the UI
        because it's still saved in <code className='text-pink-500'>time</code> state. However, it has cleared it from
        the server cache such that the next time you trigger <span className='font-bold'>Get Time</span> a new value
        will be returned.
      </p>

      <p className='mb-6'>
        Since we know that in many cases that <code className='text-pink-500'>time</code> will be in state, we can set
        our loading condition to <code className='text-pink-500'>if (pending && !time)</code>
      </p>

      <div className='flex justify-center gap-4'>
        <Button className='min-w-30' onClick={handleGetTime} loading={pending} size='sm'>
          {pending ? 'Getting Time...' : 'Get Time'}
        </Button>

        <UpdateTagButton className='min-w-30' shouldLog={true} tag='time' size='sm'>
          Purge Time
        </UpdateTagButton>

        <Button className='min-w-30' onClick={() => setTime('')} size='sm'>
          Clear Time State
        </Button>
      </div>

      {renderTime()}
    </div>
  )
}
