'use client'

import * as React from 'react'
import { toast } from 'sonner'
// import { ForcePPR } from '../ForcePPR'

import { Button, UpdateTagButton } from '@/components'
import { getTimeAction } from './getTimeAction'

/* ========================================================================

======================================================================== */

export const PrivateProtectedActionDemo = () => {
  const [time, setTime] = React.useState('')
  const [pending, setPending] = React.useState(false)

  /* ======================
        handleGetTime()
  ====================== */

  const handleGetTime = async () => {
    setTime('')
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
    if (pending) {
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
    <>
      {/* In this case, ForcePPR is not needed because the data is being rendered within a client component.
      <ForcePPR /> */}
      <div className='flex justify-center gap-4'>
        <Button className='min-w-[120px]' onClick={handleGetTime} loading={pending} size='sm'>
          {pending ? 'Getting Time...' : 'Get Time'}
        </Button>

        <UpdateTagButton className='min-w-[120px]' shouldLog={true} tag='time' size='sm'>
          Update Time
        </UpdateTagButton>
      </div>

      {renderTime()}
    </>
  )
}
