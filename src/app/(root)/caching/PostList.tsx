import { Suspense } from 'react'
import Link from 'next/link'
import { connection } from 'next/server'
import { AlertCircle } from 'lucide-react'
import {
  Alert,
  // Spinner,
  UpdateTagButton
} from '@/components'
import { getPosts } from '@/actions/cached.actions'

/* ========================================================================
              
======================================================================== */
///////////////////////////////////////////////////////////////////////////
//
// ⚠️ Gotcha:
// The associated page.tsx is rendered as static at build time. ○  (Static)
// If you're on the home page, and click the UpdateTagButton, then
// navigate to the associated Posts page, then you will STILL see cached data
// from the router cache. Setting staleTimes to 0 for static pages will have
// absolutely no effect on this:
//
//   experimental: {
//     staleTimes: {  dynamic: 0,  static: 0 }
//   }
//
//   https://nextjs.org/docs/app/api-reference/directives/use-cache#use-cache-at-runtime
//   The client router enforces a minimum 30-second stale time, regardless of configuration.
//
//   https://nextjs.org/docs/app/api-reference/directives/use-cache#revalidation
//   By default, use cache uses the default profile with these settings:
//   - stale: 5 minutes (client-side)
//   - revalidate: 15 minutes (server-side)
//   - expire: Never expires by time
//
//   However, this won't fix it either:  cacheLife({ stale: 0 })
//
//
// And then there's refresh():
//
//   https://nextjs.org/docs/app/api-reference/functions/refresh
//   refresh allows you to refresh the client router from within a Server Action.
//   That sounds like just the right solution, but it doesn't seem to work.
//   The issue is that refresh() alone doesn't solve the problem for pages that were statically
//   generated at build time (○). When you navigate with <Link>, the router cache serves the
//   cached static payload. Even though refresh() clears the router cache, on the next navigation
//   to that page, Next.js sees it's a static page and serves the pre-built static version
//   - which still contains the old cached data
//
// Navigating back to /caching via Link will reuse that router-cached tree
// instead of asking the server again, as long as the router thinks that segment is still reusable.
// static: 0 does not mean “do not cache this route at all” or “never reuse this tree during navigation.”
//
// Using headers() marks that component / segment as dynamic.
// Dynamic segments are not eligible for the same level of router caching / reuse as purely static or cached segments.
// updateTag('posts') gives you fresh data on the server.
// But navigating back to /caching via Link can still show the old tree from the Router Cache unless you router.refresh().
//
// While this solution works, the problem is also something you have to watch out for.
// Do you have a static page? Does that static page use cached data? Is that cached data
// ever going to need an immediate update? If so, then you probably want to implement headers()
// to make it ◐ (Partial Prerender).
//
///////////////////////////////////////////////////////////////////////////

// const Headers = async () => {
//   await headers()
//   return null
// }

// https://nextjs.org/docs/app/api-reference/functions/connection
const Connection = async () => {
  await connection()
  return null
}

const ForcePPR = () => {
  return (
    <Suspense fallback={null}>
      <Connection />
    </Suspense>
  )
}

export const PostList = async () => {
  // Note: Using headers() necessitates that you implement a Suspense boundary, which
  // then means that you have to concern youself more with cumulative layout shift.
  // Aurora Scharff at 2:45 implies that omitting Suspense boudaries in favor of caching
  // is a win because it prevents us from having to do the extra work associated with
  // creating skeletons to prevent CLS: https://www.youtube.com/watch?v=iRGc8KQDyQ8&t=6s
  // ⚠️ await headers()
  const { data: posts, message, success } = await getPosts()

  /* ======================

  ====================== */

  const renderContent = () => {
    if (success !== true) {
      return (
        <Alert
          leftSection={<AlertCircle className='size-6' />}
          // rightSection={<RetryButton>Retry</RetryButton>}
          title={'Error'}
          variant={'destructive'}
          className='mx-auto my-6 max-w-[800px] bg-rose-50/10'
        >
          {message}
        </Alert>
      )
    }

    if (success === true && Array.isArray(posts) && posts.length === 0) {
      return (
        <Alert
          leftSection={<AlertCircle className='size-6' />}
          // rightSection={<RetryButton>Retry</RetryButton>}
          title={'Whoops!'}
          variant={'info'}
          className='mx-auto my-6 max-w-[800px] bg-rose-50/10'
        >
          No Posts Found!
        </Alert>
      )
    }

    if (success === true && Array.isArray(posts)) {
      return (
        <>
          <ForcePPR />
          <UpdateTagButton
            className='mx-auto mb-6 flex'
            // Client-side only
            // onUpdated={(result) => { console.log('\nUpdate result:', result) }}
            shouldLog={true}
            tag='posts'
            size='sm'
          >
            Update Posts (Last Updated: {message})
          </UpdateTagButton>

          <div className='mx-auto flex max-w-[800px] flex-col gap-6'>
            {posts.map((post) => {
              return (
                <Link
                  key={post.id}
                  className='relative transition-[scale] duration-100 hover:scale-105'
                  href={`/caching/${post.id}`}
                >
                  <pre className='bg-card overflow-scroll rounded-lg border p-4 text-sm shadow'>
                    {JSON.stringify(post, null, 2)}
                  </pre>

                  <UpdateTagButton
                    className='absolute right-0 bottom-0'
                    shouldLog={true}
                    size='xs'
                    tag={`post-${post.id}`}
                    variant='secondary'
                  >
                    Update Post {post.id}
                  </UpdateTagButton>
                </Link>
              )
            })}
          </div>
        </>
      )
    }

    return null
  }

  /* ======================
          return
  ====================== */

  return <>{renderContent()}</>
}

/* ========================================================================
              
======================================================================== */

// const PostListWithSuspense = () => {
//   //# Even if cached you'll get a slight Spinner flash, so it's better to
//   //# set a brief delay on the spinner for better UX.
//   const fallback = (
//     <div className='py-12'>
//       <Spinner className='mx-auto block' size={50} />
//     </div>
//   )

//   return (
//     <Suspense fallback={fallback}>
//       <PostList />
//     </Suspense>
//   )
// }

// export { PostListWithSuspense as PostList }
