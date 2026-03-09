'use client'

import { use } from 'react'
import { AlertCircle } from 'lucide-react'

import { Alert, Button } from '@/components'
import { isPromise } from '@/utils'
import { DataProps } from './types'

/* ========================================================================
                  
======================================================================== */

export const Data = ({ onRetry, promise, shouldFetch }: DataProps) => {
  if (!isPromise(promise) || !shouldFetch) {
    return null
  }

  const res = use(promise)

  if (res.success !== true) {
    return (
      <Alert
        className='mx-auto mb-6 max-w-[600px]'
        leftSection={<AlertCircle className='size-6' />}
        rightSection={
          typeof onRetry == 'function' && (
            <Button
              className='min-w-[100px] self-center'
              onClick={() => {
                onRetry()
              }}
              size='sm'
              variant='destructive'
            >
              Retry
            </Button>
          )
        }
        title='Error'
        variant='destructive'
      >
        {typeof res?.message === 'string' ? res.message : 'Unable to get data!'}
      </Alert>
    )
  }

  return (
    <pre className='relative mx-auto mb-6 max-w-[800px] rounded-lg border border-neutral-400 bg-white p-4 shadow'>
      {JSON.stringify(
        Array.isArray(res.data) &&
          res.data.map((item: any) => {
            return {
              id: item.id,
              name: item.name,
              username: item.username,
              email: item.email
            }
          }),
        null,
        2
      )}

      <button
        className='absolute top-4 right-4 cursor-pointer'
        onClick={() => {
          onRetry?.()
        }}
      >
        <svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' fill='currentColor' viewBox='0 0 16 16'>
          <path fillRule='evenodd' d='M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2z' />
          <path d='M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466' />
        </svg>
      </button>
    </pre>
  )
}
