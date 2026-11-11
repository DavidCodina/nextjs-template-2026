'use client'
import { useState, useEffect } from 'react'
import { Modal } from '../../../'
import { Button, Input } from '@/components'
import { sleep } from '@/utils'

type FormProps = {
  onSubmitted: VoidFunction
}

/* ========================================================================
                                    Form
======================================================================== */

export const Form = ({ onSubmitted }: FormProps) => {
  const [pending, setPending] = useState(false)
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')

  /* ======================
        useEffect()
  ====================== */

  useEffect(() => {
    console.log('Form mounted.')
    return () => {
      console.log('Form unmounted.')
    }
  }, [])

  /* ======================
          return
  ====================== */

  return (
    <form onSubmit={(e) => e.preventDefault()} className='-mt-2 space-y-4'>
      <Input
        labelProps={{
          children: 'First Name',
          className: 'text-primary font-bold text-sm'
        }}

        inputProps={{
          autoComplete: 'off',
          value: firstName,
          onChange: (e) => {
            setFirstName(e.target.value)
          }
        }}
      />

      <Input
        labelProps={{
          children: 'Last Name',
          className: 'text-primary font-bold text-sm'
        }}

        inputProps={{
          autoComplete: 'off',
          value: lastName,
          onChange: (e) => {
            setLastName(e.target.value)
          }
        }}
      />

      <div className='flex justify-end gap-2'>
        {/* Use Modal.Close for the synchronous closing. */}
        <Modal.Close asChild>
          <Button className='min-w-25' size='sm' type='button' variant='destructive'>
            Cancel
          </Button>
        </Modal.Close>

        <Button
          className='min-w-25'
          onClick={async () => {
            setPending(true)
            await sleep(3000)
            setPending(false)
            onSubmitted?.()
          }}
          loading={pending}
          loadingClassName='mr-1'
          size='sm'
          type='button'
          variant='success'
        >
          {pending ? 'Saving...' : 'Save'}
        </Button>
      </div>
    </form>
  )
}
