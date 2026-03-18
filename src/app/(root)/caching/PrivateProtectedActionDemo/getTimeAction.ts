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
// ⚠️ This won't throw an error. However, there's may be a mismatch between how
// 'use cache: private' works and how it's being used here. According to AI:
//
//   'use cache: private' caches on the client (browser) via HTTP cache headers (Cache-Control: private).
//   It's designed for the RSC rendering pipeline — server components whose output
//   gets streamed to the browser, which can then cache that response.
//
//   This implementation calls getTimeAction as a server action invoked from a
//   client component, which means it goes over a POST request. Browsers do not
//   cache POST requests, full stop. So use cache: private silently does nothing
//   in this context — no error, no caching.
//
// I'm not sure if that's the actual reason it's not working.
// Note: Ali Alaa also experienced it not caching under any circumstances.
// See 51:45 : https://www.youtube.com/watch?v=hfC-S5MosGQ
//             https://github.com/vercel/next.js/issues/85672
//             https://github.com/vercel/next.js/issues/87304
//
//^ As of Next.js version 16.1.6, it seems like 'use cache: private' is STILL broken!
//
///////////////////////////////////////////////////////////////////////////

export const getTimeAction = async (): Promise<GetTimeActionData> => {
  'use cache: private'
  cacheTag('time')

  const session = await getServerSession()

  if (!session) {
    return {
      code: codes.UNAUTHORIZED,
      data: null,
      message: 'Unauthorized. User must be authenticated.',
      success: false
    }
  }

  const time = await getTime()

  return {
    code: codes.OK,
    data: time,
    message: 'success.',
    success: true
  }
}
