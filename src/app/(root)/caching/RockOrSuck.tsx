import { Suspense } from 'react'
import { cacheLife } from 'next/cache'
import { randomTrue, sleep } from '@/utils'
import { Spinner } from '@/components'

const getData = async () => {
  'use cache'
  cacheLife({
    ///////////////////////////////////////////////////////////////////////////
    //
    // https://nextjs.org/docs/app/api-reference/functions/cacheLife#inline-cache-profiles
    // The stale (i.e., staleTIme) dictates the behavior of the client router cache when
    // navigating between pages with <Link> or router.push()?
    //
    // The stale parameter in your cacheLife
    // doesn't prevent the Suspense boundary from triggering a new fetch on navigation
    // because the Suspense boundary itself creates a dynamic streaming boundary.
    // Thus, if you're using Suspense, you might as well set stale to 0.
    // In fact, you should probably ALWAYS set stale to 0 because it often results in
    // unexpected behavior - unless you're sure you're not dealing with user-generated content
    // that updates frequently.
    //
    // It seems that Next.js 16 has reverted back to a default of at least a 30s stale time.
    // This is how Next.js 14 was and it was horrible because it confused everyone!
    // They fixed it in v15 by setting it to 0, but now all of the built-in cache profiles
    // have at least 30s. Vercel decided to enforce a 30s minimum to ensure prefetched links remain usable.
    // However, most apps care more about data freshness than prefetch performances.
    //
    // I'm curious how prefetch behaves now because, it will probably work fine with a stale of 0, because it gets
    // cached by the server with 'use cache'.
    //
    // Conclusion: Always default to stale: 0 unless you have a specific reason not to. Better to have fresh data than confusing stale data.
    //
    /////////////////////////
    //
    // Reactive Client Cache vs Snapshot Navigation Cache
    //
    // stale works great in Tanstack Query because it shows you the stale data, while also doing  a background revalidation
    // and updating in real time. This is possible because Tanstack Query is a client cache. On the other hand, the main
    // cache in Next.js is a server cache, and it DOES NOT update in real time. This is why anything but stale:0 can be
    // expremely confusing in Next.js.
    //
    /////////////////////////
    //
    // What's actually different in Next.js 16
    //
    // Even if there is a stale time Next.js 16 wipes the cache entirely under the following conditions:
    //
    //   When you call revalidation functions from a Server Action (revalidateTag, revalidatePath, updateTag, or refresh),
    //   the entire client cache is immediately cleared, bypassing the stale time.
    //
    // Thus, in most cases when you're working with data that needs to update in real time, you're less concerned with
    // cacheLife and more concerned with the revalidation functions, which do immediate wipes!
    //
    // Moreover, if you want to avoid revaliation functions and all the hassle of caching, etc. You can just wrap your
    // component in Suspense, so it's always dynamic. That said, if there's a 'use cache' inside of that logic, it will
    // respect that.
    //
    ///////////////////////////////////////////////////////////////////////////
    stale: 0,
    revalidate: 15,
    ///////////////////////////////////////////////////////////////////////////
    //
    // expire is the absolute expiration.
    //
    // expire should always be ≥ revalidate. If expire < revalidate, you’re saying "throw away the cache
    // before I ever  get a chance to revalidate it." If you set it to the same as revalidate, this is
    // is fine only when stale:0 since you're already disablign SWR.
    //
    // expire should always be ≥ stale. If expire < stale, you’re essentially saying:
    // “I’m willing to serve stale data for longer than the cache itself exists.” That creates a contradiction,
    // because once the entry expires, it’s gone.
    //
    ///////////////////////////////////////////////////////////////////////////
    expire: 15
  })

  await sleep(2500)

  const getTime = () => {
    const time = new Date().toLocaleTimeString('en-US', {
      hour12: true,
      hour: 'numeric',
      minute: '2-digit',
      second: '2-digit'
    })

    return time
  }

  const isTrue = randomTrue()

  return {
    code: 'OK',
    data: {
      test: isTrue ? 'You rock!' : 'You suck!',
      time: getTime()
    },
    message: 'success',
    success: true
  }
}

/* ========================================================================

======================================================================== */

const RockOrSuck = async () => {
  const { data } = await getData()

  return (
    <pre className='bg-card mx-auto mb-6 max-w-[800px] overflow-scroll rounded-lg border p-4 shadow'>
      {JSON.stringify(data, null, 2)}
    </pre>
  )
}

/* ======================

====================== */

const RockOrSuckWithSuspense = () => {
  const fallback = (
    <div className='py-12'>
      <Spinner className='mx-auto block' size={50} />
    </div>
  )

  return (
    <Suspense fallback={fallback}>
      <RockOrSuck />
    </Suspense>
  )
}

export { RockOrSuckWithSuspense as RockOrSuck }
