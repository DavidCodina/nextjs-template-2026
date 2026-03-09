import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  ///////////////////////////////////////////////////////////////////////////
  //
  // In the production build, after updating a tag from '/', then navigating to '/caching',
  // the data would still be stale. In other words, if you're on the home page, and click t
  // he UpdateTagButton, then navigate to /caching, then you will STILL see cached data.
  // Initially, I thought the issue had to do with the fact that the page is built as static
  //
  //   ○ /caching
  //
  // The first solution Iwas to drop a custom  <ForcePPR /> into the mix to make it ◐ (Partial Prerender).
  // While that solution seems to work, it may not have been addressing the actual issue:
  //
  //   https://github.com/vercel/next.js/discussions/97485
  //
  // What was most likely happening:
  //
  //   Two separate caches were involved. Next.js has its own in-memory Router Cache, and the browser has its own HTTP cache.
  //   When you ran updateTag, Next invalidated the server entry and the in-memory Router Cache, but it has no way to reach
  //   into the browser’s HTTP cache. When you then navigated to /caching, Next requested the RSC payload, and Chrome
  //   answered from its own stored copy of the earlier response without contacting the server.
  //   Next received the old payload and displayed it.
  //
  // Why the header fixes it:
  //
  //   Cache-Control: no-store on the RSC response tells the browser not to keep a copy. Every RSC request for /caching now
  //   has to reach the server, where Next serves the current data. The has: rsc condition limits this to RSC fetches, so
  //   normal document loads aren’t affected.
  //
  ///////////////////////////////////////////////////////////////////////////

  async headers() {
    return [
      {
        source: '/((?!_next/static|_next/image|favicon.ico).*)',
        has: [{ type: 'header', key: 'rsc' }],
        headers: [{ key: 'Cache-Control', value: 'no-store' }]
      }
    ]
  },

  cacheComponents: true,
  partialPrefetching: true,
  cacheLife: {
    default: {
      stale: 60 * 5,
      revalidate: 60 * 15,
      expire: 60 * 15
    }
  },

  turbopack: {
    rules: {
      '*.css': {
        loaders: ['@tailwindcss/turbopack'],
        as: '*.css'
      }
    }
  },
  experimental: {
    ///////////////////////////////////////////////////////////////////////////
    //
    // Initially, 'use cache: private' was not working correctly. It would repeaedly
    // show new results. One solution suggested:
    //
    //   https://github.com/vercel/next.js/issues/85672
    //   staleTimes: { dynamic: 30 }
    //
    // It seems to work, but the problem with that is that we'd essentially be going
    // back to Next v14 router cache behvior, which was a nightmare! I think
    // updateTag, revalidateTag, and revalidatPath flush the router cache, but for
    // uncached content, we could still run into router cache issues.
    //
    // In other words, if we set have a page that makes a fetch to get posts, then we navigate away,
    // create a post, and navigate back (i.e., router.push('/posts') all within 30s, then the
    // expected behavior would be to see stale data. That's bad!
    //
    // Tl;DR: staleTimes: { dynamic: 30 } seems to fix the 'use cache: private' bug, but the
    // trade-off is that you're essentially reverting to Next v14 behavior, which is awful!
    //
    // The actual problem seems to be that, for whatever reason, 'use cache: private' does not
    // behave as expected during dev mode, but it will work correctly if you run the build.
    // dev and production treat private caches differently.
    //
    // Why dev likely looked broken:
    //
    //   1. Prefetching. The prefetching guide says Next.js prefetches automatically in production.
    //      The client-side reuse depends on the App Shell and prefetch machinery, so in dev there
    //      is nothing for the client to reuse and every navigation hits the server.
    //
    //   2. Stale-while-revalidate on the dev server. Serving the old result while regenerating
    //      means each navigation can show a different value from the previous one, which looks
    //      like “the time keeps updating.”
    //
    ///////////////////////////////////////////////////////////////////////////
    // ❌ staleTimes: { dynamic: 30 }
    // authInterrupts: true
  },

  //# typedRoutes: true,
  // reactStrictMode: false, // ⚠️ Only uncomment this for testing during development.
  // https://nextjs.org/docs/app/api-reference/next-config-js/logging
  logging: {
    fetches: {
      fullUrl: true
    }
  },

  images: {
    // Allow images from google, github, linkedin, etc. for auth providers.
    // Needs LinkeIn still...

    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com'
      },
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com'
      }
    ],
    domains: [
      // 'upload.wikimedia.org',
      // 'images.pexels.com',
      // 'images.unsplash.com'
    ]
  }
  // async rewrites() {
  //   return [
  //     {
  //       source: '/api/:path*',
  //       destination: 'http://localhost:5000/api/:path*' // Your Express server's address
  //     }
  //   ]
  // }
}

export default nextConfig
