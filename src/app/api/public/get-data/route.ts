import { codes, randomFail } from '@/utils'

/* ========================================================================

======================================================================== */
///////////////////////////////////////////////////////////////////////////
//
// Nuxt.js uses Nitro/H3 for their API routes. With Nitro a thrown error
// results in a response body with { status, statusText, data, ... }. However,
// Next.js simply returns a response with status 500, but no actual response body.
//
// The message passed to Error() here would never reach the client.
//
//   if (randomFail()) { throw new Error('A random failure occurred.') }
//
// Generally, that's a good thing, so internal error details don’t leak to clients by accident.
// However, in some cases we may still want to send back a response body to the client when
// an error occurs. In such cases, it will always show up in the Network -> Response section,
// so whatever you send back will be public, even if it's not in the UI.
//
// LinkedIn Post: https://www.linkedin.com/posts/david-codina-b7b015230_nextjs-api-routes-im-not-going-to-explain-share-7523474525741666304-t3NT
//
///////////////////////////////////////////////////////////////////////////

export async function GET(_req: Request) {
  try {
    if (randomFail()) {
      return Response.json(
        {
          // In many cases, the HTTP status code should be sufficient to infer
          // what the issue, but one can add message and/or custom code.
          message: 'A random failure occurred.',
          code: codes.FAILURE_TEST
        },
        { status: 400, statusText: 'Bad Request' }
      )
    }

    const time = new Date().toLocaleTimeString('en-US', {
      hour12: true,
      hour: 'numeric',
      minute: '2-digit',
      second: '2-digit'
    })

    return Response.json({
      message: 'You have requested data from GET: /api/public/get-data',
      time
    })
  } catch (_err) {
    return Response.json(
      {
        message: 'An error occurred on the server.',
        code: codes.INTERNAL_SERVER_ERROR
      },
      {
        status: 500,
        statusText: 'Internal Server Error'
      }
    )
  }
}

/* ========================================================================

======================================================================== */
/* 
Usage:


'use client'
import { useQuery } from '@tanstack/react-query'
import { parseResponse } from '@/utils'

const getData = async () => {
  const res          = await fetch('http://localhost:3000/api/public/get-data')
  const _status      = res.status // Use this as needed.
  const statusText   = res.statusText || 'Internal Server Error'
  const resBody      = await parseResponse(res)
  const errorMessage = resBody && typeof resBody === 'object' && 'message' in resBody && typeof resBody.message === 'string' ? resBody.message : statusText

  if (!res.ok) { throw new Error(errorMessage) }
  return resBody
}


export const ClientComponent = () => {
  const { data, error, status } = useQuery({ queryFn: getData, queryKey: ['my-data'], retry: false, gcTime: 0 })

  const renderContent = () => {
    if (status === 'pending') {
      return <div className='text-info my-12 text-center text-3xl font-bold'>Loading...</div>
    }

    if (data) {
      return (
        <pre className='bg-card mx-auto max-w-180 overflow-x-auto rounded-lg border p-4 text-sm shadow-sm'>
          <code>{JSON.stringify(data, null, 2)}</code>
        </pre>
      )
    }

    if (error) {
      return <div className='text-destructive my-12 text-center text-3xl font-bold'>{error.message}</div>
    }

    return null
  }

  return renderContent()
}
*/
