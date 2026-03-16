import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Implementing "use cache" requires enabling the feature flag.
  cacheComponents: true,
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
