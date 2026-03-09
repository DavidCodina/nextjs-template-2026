'use client'

import { useErrorBoundary } from 'react-error-boundary'
import { AlertCircle } from 'lucide-react'
import { Alert, Button } from '@/components'

/* ========================================================================

======================================================================== */

export const ErrorFallback = () => {
  const { resetBoundary } = useErrorBoundary()

  return (
    <Alert
      className='mx-auto mb-6 max-w-[600px]'
      leftSection={<AlertCircle className='size-6' />}
      rightSection={
        <Button className='min-w-[100px] self-center' onClick={resetBoundary} size='sm' variant='destructive'>
          Reset
        </Button>
      }
      title='Error'
      variant='destructive'
    >
      Request failed! (Error Boundary)
    </Alert>
  )
}
