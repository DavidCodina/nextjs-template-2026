'use client'

import * as React from 'react'
import { toast } from 'sonner'

import { Button, UpdateTagButton } from '@/components'
import { getTimeAction } from './getTimeAction'

/* ========================================================================

======================================================================== */

export const PrivateProtectedActionDemoFail = () => {
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
      <div className='flex justify-center gap-4'>
        <Button className='min-w-30' onClick={handleGetTime} loading={pending} size='sm'>
          {pending ? 'Getting Time...' : 'Get Time'}
        </Button>

        <UpdateTagButton className='min-w-30' shouldLog={true} tag='PRIVATE_TIME_TAG' size='sm'>
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
