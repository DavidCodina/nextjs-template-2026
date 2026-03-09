///////////////////////////////////////////////////////////////////////////
//
// Do not put 'use client' in this file, because both the server and the browser import it.
//
// Why a factory? If you wrote const queryClient = new QueryClient() at the top of a file,
// the server would share one cache between all visitors and could leak one user's data to another.
// A new client per request prevents that.
//
///////////////////////////////////////////////////////////////////////////

import { QueryClient, defaultShouldDehydrateQuery, environmentManager } from '@tanstack/react-query'

/* ========================================================================

======================================================================== */

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        ///////////////////////////////////////////////////////////////////////////
        //
        // Often in tutorials, you'll see them set staleTime: 60 * 1000.  We need to set
        // it above 0, so data from the server is not refetched IMMEDIATELY in the browser.
        // However, 60 seconds is too long. In practice, a user could navigate away from the
        // page, trigger a mutation, then navigate back to the page all within that timeframe.
        // In such cases, the query would not do a background refetch! You would have to
        // always concern yourself with explicit invalidation after every mutation.
        //
        // Ideally, the goal is to prevent IMMEDIATE refetching, while still being as close as
        // possible to the original default staleTime of 0. In other words, it should only be long
        // enough to cover the server-to-hydration handoff. If 5 seconds is not long enough, then
        // the client will simply do a background refetch, which is basically harmless. The alternative
        // is making the staleTime too long, in which case it could potentially result in stale data with
        // no refetching.
        //
        // A long staleTime makes invalidation mandatory, while a short one makes it optional.
        //
        ///////////////////////////////////////////////////////////////////////////
        staleTime: 5 * 1000
        // retry: false
      },
      dehydrate: {
        // Also send queries that are still loading (this enables streaming)
        shouldDehydrateQuery: (query) => defaultShouldDehydrateQuery(query) || query.state.status === 'pending',
        // Let Next.js see its own server errors (it needs them to detect dynamic pages)
        shouldRedactErrors: () => false
      }
    }
  })
}

let browserQueryClient: QueryClient | undefined = undefined

/* ========================================================================

======================================================================== */

export function getQueryClient() {
  // No longer do we do: import { isServer} from '@tanstack/react-query'
  if (environmentManager.isServer()) {
    // Server: a brand-new client every time, so users never share a cache
    return makeQueryClient()
  }
  // Browser: create once and reuse
  if (!browserQueryClient) browserQueryClient = makeQueryClient()
  return browserQueryClient
}
