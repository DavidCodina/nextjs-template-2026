'use client'

import { catchError, type ErrorInfo } from 'next/error'
import { AlertCircle } from 'lucide-react'
import { Alert, Button } from '@/components'

/* ========================================================================
              
======================================================================== */
///////////////////////////////////////////////////////////////////////////
//
// https://nextjs.org/docs/app/api-reference/functions/catchError
//
// Usage:
//
//   <PostListErrorBoundary title='Posts'>
//     <PostList />
//   </PostListErrorBoundary>
//
///////////////////////////////////////////////////////////////////////////

const PostListError = (_props: { title: string }, errorInfo: ErrorInfo) => {
  const { error, retry } = errorInfo
  const errorMessage =
    error && typeof error === 'object' && 'message' in error && typeof error.message === 'string'
      ? error.message
      : 'An error occurred.'

  return (
    <Alert
      leftSection={<AlertCircle className='size-6' />}
      rightSection={
        <Button size='sm' variant='destructive' onClick={() => retry()}>
          Retry
        </Button>
      }
      title={'Error'}
      variant={'destructive'}
      className='mx-auto my-6 max-w-200'
    >
      {errorMessage}
    </Alert>
  )
}

export const PostListErrorBoundary = catchError(PostListError)
