import { cacheLife, cacheTag } from 'next/cache'
import { codes, sleep } from '@/utils'
import { getServerSession } from '@/utils'

const getTime = () => {
  return new Date().toLocaleTimeString('en-US', {
    hour12: true,
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit'
  })
}

export const getDataAction = async () => {
  // Gotcha: 'use cache: private' still requires Suspense.
  // https://github.com/vercel/next.js/issues/85672
  // "The function re-executes on every... navigation."
  // See also: https://github.com/vercel/next.js/issues/87304
  // To be fair, this feature is still experimental, but as per
  // usual Next.js is releasing half-baked features.
  'use cache: private'
  cacheTag('my-data')
  cacheLife({ stale: 60 })

  await sleep(2000)

  const session = await getServerSession()

  if (!session) {
    return {
      code: codes.UNAUTHORIZED,
      data: null,
      message: 'Not authorized.',
      success: false
    }
  }

  return {
    code: codes.OK,
    data: {
      test: 'Testing 123...',
      time: getTime()
    },
    message: 'success',
    success: true
  }
}
