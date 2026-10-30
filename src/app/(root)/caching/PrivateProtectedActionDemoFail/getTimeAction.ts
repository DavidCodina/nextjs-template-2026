'use server'

import { cacheTag } from 'next/cache'
import { codes, sleep, getServerSession } from '@/utils'
import { ResponsePromise } from '@/types'

type Data = string
export type GetTimeResponsePromise = ResponsePromise<Data | null>
export type GetTime = () => GetTimeResponsePromise
export type GetTimeResolvedResponse = Awaited<GetTimeResponsePromise>

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
/////////////////////////
//
// Why doesn't this example work?
//
//   The problem is that 'use cache: private' doesn’t cache a Server Action call the way
//   you’re expecting. It isn’t a server-side cache at all.
//
//   According to the Next.js docs, results are never stored on the server, they’re cached only
//   in the browser’s memory and do not persist across page reloads... The “cache” is the client
//   router holding onto the server-rendered result (the RSC payload) so it can reuse it during
//   navigation, within the configured stale window.
//
// Why your demo never hits the cache
//
//   Your button calls getTimeAction() directly from a click handler. That’s a fresh POST request
//   to the server every time. Nothing is stored server-side, and the client router cache doesn’t
//   sit in front of Server Action calls, so the function body runs again and you get a new time
//   (and a new 3-second wait). The directive is effectively a no-op in this setup. The docs don’t
//   spell this out for actions specifically, but it follows from the model they describe.
//
// TL;DR
//
//   1. There's no way of effectively using 'use cache: private' against a server action?
//      The cache lives in the browser’s memory and is reused when a server-rendered result
//      is already on the client. A Server Action call from a click handler is a brand-new
//      POST every time, so nothing intercepts it and the function runs again. The docs don’t
//      explicitly say “not supported for actions.” I’m inferring that from how the feature
//      works, and your demo’s behavior matches it.
//
//   2. The actual way to implement 'use cache: private' is on a server component.
//      Put 'use cache: private' in a function or component that runs during a server render,
//      and the result gets cached in the browser. You’ll see it when you navigate away and
//      back within the stale window (30 seconds minimum).
//
///////////////////////////////////////////////////////////////////////////

export const getTimeAction: GetTime = async () => {
  'use cache: private'
  cacheTag('PRIVATE_TIME_TAG')

  const session = await getServerSession()
  await sleep(3000)

  if (!session) {
    return {
      code: codes.UNAUTHORIZED,
      data: null,
      message: 'Unauthorized. User must be authenticated.',
      success: false
    }
  }

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
