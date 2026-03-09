'use server'
// In Next.js, when you have utility functions that use server-only APIs like next/headers,
// you need to mark the file with the "use server" directive at the top. This tells Next.js
// that the code in this file should only run on the server.

import { cache } from 'react'
import { headers } from 'next/headers'
import { auth } from '@/lib/auth'

// Todo: implement the server-only package here.

///////////////////////////////////////////////////////////////////////////
//
// At 30:15 in the Coding In Flow tutorial, he creates this server-side
// utility. Can be used in server components, server actions and API
// router hanlders. Usage:
//
//   const session = await getServerSession()
//
// At 45:00 in the Coding In Flow tutorial he updates it to use cache().
// I'm a little unfamiliar with cache. We obviously don't literally want
// to cache the data here. I think what cache() does it handle deduplication,
// but I'll need to research this.
//
// "This deduplicates the function within the same request... This is how you
// deduplicate requests in server components."
//
///////////////////////////////////////////////////////////////////////////

//# Test this by calling it twice in ServerSession.tsx, within a Promise.all()

/** A helper function built on top of Better Auth's auth.api.getSession().
 * It returns session or null, and uses React cache to deduplicate the request.
 */
export const getServerSession = cache(async () => {
  try {
    // The pattern for getting a server session is demonstrated
    // at better-auth.com/docs/basic-usage#server-side
    // session breaks down into session.session and session.user
    // If there's no session, then auth.api.getSession will simply return null.
    // However, I still wrap this in a try/catch just to be safe.
    const session = await auth.api.getSession({
      ///////////////////////////////////////////////////////////////////////////
      //
      // Note: headers() returns a Promise due to the way Next.js works internally.
      // However, the actual logic of getting headers will take milliseconds.
      // In practice, this means that a Suspense fallback will not be triggered
      // by getServerSession itself.
      //
      // ⚠️ However, you'll still need to wrap the component in Suspense that directly or
      // indirectly consumes the function, and this is where things get annoying.
      // If you're unauthenticated, then the response will return under the Suspense
      // threshold. But if you're authenticated, then the process of getting cached data
      // still exceeds the Suspense threshold, and the fallback will be triggered.
      //
      ///////////////////////////////////////////////////////////////////////////
      headers: await headers()
    })

    return session
  } catch {
    return null
  }
})
