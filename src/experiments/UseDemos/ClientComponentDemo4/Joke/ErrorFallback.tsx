import { FallbackProps } from 'react-error-boundary'
import { AlertCircle } from 'lucide-react'
import { Alert, Button } from '@/components'

/* ========================================================================

======================================================================== */

export const ErrorFallback = ({ /* error, */ resetErrorBoundary }: FallbackProps) => {
  // Or set message to error.message if you want to show the actual error message.
  // That said, exposing error information to the client is generally discouraged..
  const message = 'Oh snap! Something bad happened!'

  return (
    <Alert
      className='mx-auto mb-6 max-w-[600px]'
      leftSection={<AlertCircle className='size-6' />}
      rightSection={
        <Button className='min-w-[100px] self-center' onClick={resetErrorBoundary} size='sm' variant='destructive'>
          Reset
        </Button>
      }
      title='Error'
      variant='destructive'
    >
      {message}
    </Alert>
  )
}
