'use server'

import { cacheTag } from 'next/cache'
import { codes, sleep, getServerSession } from '@/utils'
import { ResponsePromise } from '@/types'

/* ========================================================================

======================================================================== */
///////////////////////////////////////////////////////////////////////////
//
// ⚠️ Gotcha: Neither 'use cache' nor 'use cache: remote' can access runtime
// values like cookies or search params directly.
//
//   ❌ const session = await getServerSession()
//
// This means that if you try to do a session check with 'use cache' or 'use cache: remote'
// you'll get this error:
//
//   ❌ Error: Route /caching used `headers()` inside "use cache".
//   Accessing Dynamic data sources inside a cache scope is not supported.
//   If you need this data inside a cached function use `headers()` outside
//   of the cached function and pass the required dynamic data in as an argument.
//   See more info here: https://nextjs.org/docs/messages/next-request-in-use-cache
//
///////////////////////////////////////////////////////////////////////////

const getTime = async () => {
  'use cache'
  cacheTag('time')

  await sleep(2000)

  const time = new Date().toLocaleTimeString('en-US', {
    hour12: true,
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit'
  })

  return {
    code: codes.OK,
    data: time,
    message: 'success.',
    success: true
  }
}

/* ========================================================================

======================================================================== */
// In order to protect a server action, while also caching the result, you need
// to handle the session check outside of the core server action. Note that in
// this case, the cached getTimeAction is NOT returning private data.

type Data = string
type GetTimeActionResponsePromise = ResponsePromise<Data | null>
type GetTimeAction = () => GetTimeActionResponsePromise

export const getTimeAction: GetTimeAction = async () => {
  const session = await getServerSession()

  if (!session) {
    return {
      code: codes.UNAUTHORIZED,
      data: null,
      message: 'Unauthorized. User must be authenticated.',
      success: false
    }
  }
  return getTime()
}
