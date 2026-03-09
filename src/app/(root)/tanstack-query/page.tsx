import type { Metadata } from 'next'
import { connection } from 'next/server'
import {
  dehydrate,
  HydrationBoundary,
  noop
  // queryOptions
} from '@tanstack/react-query'

import { Page, PageContainer, Title } from '@/components'
import { getQueryClient } from '@/utils'
import { getPosts } from './getPosts'
import { PostList } from './PostList'

export const metadata: Metadata = {
  title: 'Test',
  description: 'A Test Page'
}

/* ========================================================================
              
======================================================================== */
///////////////////////////////////////////////////////////////////////////
//
// Why would we even bother using TanStack Query in a Next.js application?
// This is the question posed in ByteGrad’s youtube video:
//
//   https://www.youtube.com/watch?v=51pf_nCJpwg
//   Why I don't use React-Query and tRPC in Next.js**
//
// However, the answer is simple. *Maybe you don’t like the Next.js server caching
// mechanisms. Ideally, you’d switch to TanStack Start, which has client-first caching
// mechanisms, but let’s say that for some reason you are still using Next.js. That
// doesn’t mean you have to leverage their caching system, which honestly kind of sucks.
// Solution: just use TanStack Query instead.
//
///////////////////////////////////////////////////////////////////////////

export const instant = false

const PageTest = async () => {
  ///////////////////////////////////////////////////////////////////////////
  //
  // ⚠️Gotcha: Without connection(), you'll get this error:
  //
  //   Next.js encountered the unstable value Date.now() while prerendering.
  //   This value can change between renders, so it must be either prerendered or computed later.
  //
  // This happens when the app is configured to cacheComponents:true. In such cases,
  //  dehydrate() reads the current time and subsequently triggers the error.
  // Solution: await connection()
  //
  // But with connection(), you'll get this error:
  //
  //   Next.js encountered uncached data during prerendering.
  //   This prevents the route from being prerendered, blocking navigation and leading to a slower user experience.
  //
  // Solution to the second error is to use instant of false or move all the logic into a child component
  // and wrap with Suspense. Generally, I hate Suspense implementations and love me some good old-fashioned
  // blocking behavior.
  //
  ///////////////////////////////////////////////////////////////////////////

  await connection()

  // Older tutorials may use queryClient.prefetchQuery() and ensureQueryData()
  // The newer approach is to use queryClient.query(). The old methods are
  // deprecated and will be removed in v6.
  const queryClient = getQueryClient()

  ///////////////////////////////////////////////////////////////////////////
  //
  // queryClient.query() is the v5 replacement for fetchQuery, and per the current docs both
  // fetchQuery(), ensureQueryData(), and prefetchQuery() are deprecated and will be removed
  // in the next major version.
  //
  //   - If the cache has data for that key and it isn’t stale (per staleTime),
  //     it resolves with the cached data and doesn’t fetch.
  //
  //   - If the data is missing or stale, it runs queryFn, stores the result in
  //     the cache, and resolves with it.
  //
  //   - If queryFn throws, the promise rejects.
  //
  // queryClient.query(...) starts the fetch. .catch(noop) swallows errors
  // on purpose: a failed prefetch is simply retried in the browser, so the
  // page degrades gracefully instead of crashing.
  //
  // Why void? void tells everyone you are intentionally not awaiting.
  // Ultimately, the behavior I want is to block navigation when there is no
  // cached data. At first, you might think that using await here is the solution.
  // However, the gotcha here is that getQueryClient() creates a brand-new QueryClient
  // on EVERY server request, so the server cache is always empty when query() runs.
  // This means it would ALWAYS block navigation. The server has no way to know what’s
  // in the browser’s cache, so it can’t skip the fetch.
  //
  // The actual solution is to use export const instant = false on the top-level
  // page.tsx in conjunction with useSuspenseQuery() where the data is used.
  //
  //   const { data, isError, error } = useSuspenseQuery({
  //     queryKey: ['posts'],
  //     queryFn: getPosts
  //   })
  //
  // What useSuspenseQuery does:
  //
  //   - Data in cache: it returns the data immediately, like useQuery with
  //     data already loaded. If the data is stale, a background refetch starts,
  //     and the component re-renders when it arrives.
  //
  //   - No data, but a fetch in flight (your hydrated pending query from the server):
  //     it suspends until that promise resolves.
  //
  //   - No data, no fetch: it starts the fetch and suspends.
  //
  // Suspending means the component throws a promise, and React looks upward for the nearest
  // <Suspense> boundary to show as a fallback. The component never renders in a “pending” state.
  // It either has data or it isn’t rendered yet.
  //
  // Note: If we remove all the server-side prefetch logic, then the only thing that changes is where
  // the initial request is made from. In practice, the navigation blocking still occurs. The only real
  // benefit here is possibly SEO if the HTML is rendered in the source code. However, the combination
  // of the useSuspenseQuery() + export const instant = false even WITHOUT the server-side prefetch still
  // results in the HTML being sent over in the source code. In other words, same benefit and NO NEED for
  // the server-side prefetch.
  //
  ///////////////////////////////////////////////////////////////////////////

  void queryClient
    .query({
      queryKey: ['posts'],
      queryFn: getPosts
    })
    .catch(noop)

  /* ======================
          return
  ====================== */

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Page>
        <PageContainer>
          <Title
            as='h2'
            style={{
              marginBottom: 50,
              textAlign: 'center'
            }}
          >
            Query Page
          </Title>

          <PostList />
        </PageContainer>
      </Page>
    </HydrationBoundary>
  )
}

export default PageTest
