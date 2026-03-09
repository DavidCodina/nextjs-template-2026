import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  ///////////////////////////////////////////////////////////////////////////
  //
  // https://github.com/vercel/next.js/discussions/97485
  // In the production build, after updating a tag from '/', then navigating to '/caching',
  // the data would still be stale. What was most likely happening:
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
  turbopack: {
    rules: {
      '*.css': {
        loaders: ['@tailwindcss/turbopack'],
        as: '*.css'
      }
    }
  },
  experimental: {
    // staleTimes: { dynamic: 0, static: 0 }
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
