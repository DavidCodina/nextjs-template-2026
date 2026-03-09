import { cacheTag } from 'next/cache'
import { ForcePPR } from '../ForcePPR'
import { UpdateTagButton } from '@/components'

const getTime = async () => {
  'use cache: remote'
  cacheTag('time')

  const time = new Date().toLocaleTimeString('en-US', {
    hour12: true,
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit'
  })

  console.log(`\nGetting time: ${time}\n`)

  return time
}

/* ========================================================================
              
======================================================================== */
// https://nextjs.org/docs/app/api-reference/directives/use-cache-remote
// Remote caching provides the most value when content is deferred to request
// time (outside the static shell). This typically happens when a component
// accesses request values like cookies(), headers(), or searchParams, placing
// it inside a Suspense boundary.
//
// Note: like 'use cache', 'use cache: remote' (AKA cache at runtime) is still shared across all users.

///////////////////////////////////////////////////////////////////////////
//
// ⚠️ Gotcha:
// Next.js still is aggressive at build time when creating static pages.
// The associated page.tsx is rendered as static at build time. ○  (Static)
//
//   ○ /caching
//
// If you're on the home page, and click the UpdateTagButton, then
// navigate to /caching, then you will STILL see cached data
// from the router cache.
//
// Using headers() marks that component / segment as dynamic.
// Dynamic segments are not eligible for the same level of router caching / reuse as purely static or cached segments.
// updateTag('time') gives you fresh data on the server.
// But navigating back to /caching via Link can still show the old tree from the Router Cache unless you router.refresh().
//
// While this solution works, the problem is also something you have to watch out for.
// Do you have a static page? Does that static page use cached data? Is that cached data
// ever going to need an immediate update? If so, then you probably want to implement headers()
// to make it ◐ (Partial Prerender).
//
///////////////////////////////////////////////////////////////////////////

export const UseCacheRemote = async () => {
  const time = await getTime()

  /* ======================
          return
  ====================== */

  return (
    <>
      <ForcePPR />
      <UpdateTagButton className='mx-auto flex' shouldLog={true} tag='time' size='sm'>
        Update Time
      </UpdateTagButton>
      <div className='text-primary my-12 text-center text-4xl font-bold'>{time}</div>
    </>
  )
}
