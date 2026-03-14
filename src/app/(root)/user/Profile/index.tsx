'use client'
import dynamic from 'next/dynamic'
import { authClient } from '@/lib/auth-client'
import { UpdateUserForm } from './UpdateUserForm'

/* ========================================================================

======================================================================== */
// Coding in Flow at 1:42:30 : https://www.youtube.com/watch?v=w5Emwt3nuV0

export const Profile = () => {
  ///////////////////////////////////////////////////////////////////////////
  //
  // Generally, prefer server components with getServerSession(). However, this Next.js
  // app is using cacheComponents:true, which prohibits render blocking and makes getting
  // server sessions a worse user experience. On the other hand, client sessions are generally
  // immediate because of the nanostore.
  //
  // ⚠️ Gotcha: Hydration mismatches can occur on manual browser refresh when implementing authClient.useSession()
  // https://github.com/better-auth/better-auth/pull/2776
  // https://github.com/better-auth/better-auth/issues/2462
  // https://github.com/better-auth/better-auth/issues/960
  //
  // Despite the above issues being closed, there's still an issue such that isPending is always
  // true on the server, but false on the client. It's necessarily false on the client because
  // the server session gets stored in the nanostore before useSession() runs on the client.
  // In other words, by the time authClient.useSession() runs, the session is always immediately available.
  // This means that we have a fundamentalarchitectural tension. If it is a bug, it's now one we created!
  //
  // Using suppressHydrationWarning won't fix the issue. That prop is designed for single element
  // attribute differences, not component tree content mismatches. It won't actually silence the error.
  // Also, the code is fine — it's a known limitation of the library itself.
  //
  // Solution 1 : Simply ignore the error in development. It won't actually trigger in production.
  // While this might be okay for personal projects, it's probably not a good idea for production-grade
  // applications.
  //
  // Solution 2: Render session-dependent UI only on the client
  //
  //   const [mounted, setMounted] = React.useState(false)
  //   React.useEffect(() => { setMounted(true) }, [])
  //   if (!mounted) return null
  //
  //
  // Solution 3: Prefer fetching session data on the server and passing it to the client.
  //
  // Solution 4: Using dynamic() :
  //
  //   import dynamic from 'next/dynamic'
  //   export const DynamicProfile = dynamic(() => import('./').then((module) => module.Profile), { ssr: false })
  //
  ///////////////////////////////////////////////////////////////////////////

  const value = authClient.useSession()
  const { data, error, isPending /*, isRefetching, refetch */ } = value
  const user = data?.user || null

  /* ======================
      renderContent()
  ====================== */

  const renderContent = () => {
    if (error) {
      return <div className='my-12 text-center text-4xl font-black text-red-500'>An error occurred.</div>
    }

    if (isPending) {
      // Todo: Add loading UI.
      return <div className='text-primary my-12 text-center text-4xl font-black'>Loading...</div>
    }

    if (!data) {
      return <div className='my-12 text-center text-4xl font-black text-red-500'>No Client Session.</div>
    }

    return <UpdateUserForm user={user} />
  }

  /* ======================
          return
  ====================== */

  return renderContent()
}

///////////////////////////////////////////////////////////////////////////
//
// Why not create DynamicProfile.tsx and use that instead?
//
//   'use client'
//   import dynamic from 'next/dynamic'
//   export const DynamicProfile = dynamic(() => import('./').then((module) => module.Profile), { ssr: false })
//
// With that approach, the DynamicProfile would blink in the first time it was accessed.
// With this approach it:
//
//   - Does not code-split.
//   - Does not reduce bundle size.
//   - Does disables SSR.
//
// Note: using DynamicProfile means you don't get the benefits of running the client
// component on the server first (e.g., SEO, etc.). However, this content is only shown
// to the authenticate user, so from an SEO perspective there's no meaningful content to index.
//
///////////////////////////////////////////////////////////////////////////

export const DynamicProfile = dynamic(() => Promise.resolve(Profile), { ssr: false })
