'use server'

import { cacheTag } from 'next/cache'
import { codes, sleep, getServerSession } from '@/utils'

type GetTimeActionData = {
  code: string
  data: any
  message: string
  success: boolean
}

const getTime = async () => {
  await sleep(3000)
  const time = new Date().toLocaleTimeString('en-US', {
    hour12: true,
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit'
  })

  // console.log(`\nGetting time: ${time}\n`)
  return time
}

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

const getTimeAction = async (): Promise<GetTimeActionData> => {
  'use cache'
  cacheTag('time')

  const time = await getTime()

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

const getTimeActionProtected = async () => {
  const session = await getServerSession()

  if (!session) {
    return {
      code: codes.UNAUTHORIZED,
      data: null,
      message: 'Unauthorized. User must be authenticated.',
      success: false
    }
  }
  return getTimeAction()
}

export { getTimeActionProtected as getTimeAction }
