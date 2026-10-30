// This is NOT a server action! It's a server function (AKA server-only query function).
// There's a difference. This is an async fetch function that ONLY get called on the server.
// It's merely an abstraction, rather than running the logic directly in a server component.
// Consequently, we're not breaking the rules, which say server actions should only be used
// for mutations. Technically, that's arguable, but we're still following best practices here.
// ❌  'use server'

import 'server-only'
import { cacheTag } from 'next/cache'

import { codes, sleep, getServerSession } from '@/utils'
import { ResponsePromise } from '@/types'

type Data = string
export type GetTimeResponsePromise = ResponsePromise<Data | null>
export type GetTime = () => GetTimeResponsePromise
export type GetTimeResolvedResponse = Awaited<GetTimeResponsePromise>

export const PRIVATE_TIME_TAG = 'PRIVATE_TIME_TAG'

/* ========================================================================

======================================================================== */
// ⚠️ Gotcha. Test the build not dev. Why?
// Next.js only prefetches automatically in production.

export const getTime: GetTime = async () => {
  'use cache: private'
  cacheTag(PRIVATE_TIME_TAG)

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
