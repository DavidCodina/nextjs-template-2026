import * as React from 'react'
import { tryCatchAsync } from '../.'
import type { ResponsePromise } from '@/types'
import { Alert, Button } from '@/components'
import { codes, handleError, randomFail, sleep } from '@/utils'

type Post = {
  userId: number
  id: number
  title: string
  body: string
}

type GetPostsData = Post[] | null
type GetPostsResponsePromise = ResponsePromise<GetPostsData>
type GetPosts = () => GetPostsResponsePromise

/* ======================

====================== */

const getPosts: GetPosts = async () => {
  await sleep(1500)
  const { data: res, error } = await tryCatchAsync(fetch(`https://jsonplaceholder.typicode.com/posts?_limit=2`))

  if (error) {
    return handleError(error)
  }

  const { data, error: jsonError } = await tryCatchAsync(res.json() as Promise<Post[]>)

  if (!res.ok || jsonError || randomFail()) {
    return {
      code: codes.INTERNAL_SERVER_ERROR,
      data: null,
      message: 'The request failed.',
      success: false
    }
  }

  return {
    code: codes.OK,
    data: data,
    message: 'success',
    success: true
  }
}

/* ========================================================================

======================================================================== */
///////////////////////////////////////////////////////////////////////////
//
// This example demonstrates a cleaner way of using tryCatchAsync.
// Here we're using it directly within the client-side API function (above).
// While this works, I still don't see it as a huge improvement.
//
// In this case, the abstraction merely makes the API function more obscure.
// The above implementation works, but it will likely be confusing to other
// developers, with no real added benefit.
//
// Once again, I do see a practical use case for tryCatchAsync, but in general
// I don't recommend using it for client-side API functions.
//
///////////////////////////////////////////////////////////////////////////

export const TryCatchDemo2 = () => {
  const [error, setError] = React.useState('')
  const [pending, setPending] = React.useState(false)
  const [data, setData] = React.useState<unknown[] | null>(null)

  /* ======================
    handleGetData()
  ====================== */

  const handleGetData = async () => {
    setError('')
    setPending(true)
    setData(null)

    const { data, message, success } = await getPosts()

    if (success === false) {
      setError(message || 'Something went wrong.')
    } else if (data) {
      setData(data)
    }

    setPending(false)
  }

  /* ======================
      renderData()
  ====================== */

  const renderData = () => {
    if (error) {
      return (
        <Alert className='mx-auto mb-6 max-w-125 dark:bg-(--destructive-soft)/15' title='Error' variant='destructive'>
          <p>{error}</p>
        </Alert>
      )
    }

    if (pending) {
      return <div className='text-primary text-center text-3xl'>Pending...</div>
    }

    if (data) {
      return (
        <pre className='bg-card mx-auto mb-6 max-w-250 overflow-scroll rounded-lg border p-4 text-sm shadow'>
          {JSON.stringify(data, null, 2)}
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
        <Button className='min-w-37.5' loading={pending} onClick={handleGetData} size='sm'>
          {pending ? 'Pending...' : 'Get Data'}
        </Button>
      </div>

      {renderData()}
    </div>
  )
}
