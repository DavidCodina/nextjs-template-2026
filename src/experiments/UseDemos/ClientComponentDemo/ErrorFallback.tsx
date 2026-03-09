'use client'

import { AlertCircle } from 'lucide-react'
import { Alert, Button } from '@/components'

/* ========================================================================
                                ErrorFallback                 
======================================================================== */

export const ErrorFallback = ({ error, onReset }: any) => {
  return (
    <Alert
      className='mx-auto mb-6 max-w-[600px]'
      leftSection={<AlertCircle className='size-6' />}
      rightSection={
        typeof onReset === 'function' && (
          <Button
            className='min-w-[100px] self-center'
            onClick={() => {
              if (typeof onReset === 'function') {
                onReset?.()
              }
            }}
            size='sm'
            variant='destructive'
          >
            Reset
          </Button>
        )
      }
      title='Error'
      variant='destructive'
    >
      {error?.message || 'Unable to get data!'}
    </Alert>
  )
}
