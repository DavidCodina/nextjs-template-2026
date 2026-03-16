'use client'

import dynamic from 'next/dynamic'

import { authClient } from '@/lib/auth-client'
import { UpdateUserForm } from './UpdateUserForm'
import { UpdateEmailForm } from './UpdateEmailForm'
import { UpdatePasswordForm } from './UpdatePasswordForm'

//# To what extent does Better Auth support cross-tab synchronization?
//# Test it out in two separate tabs.

/* ========================================================================

======================================================================== */
// Coding in Flow at 1:42:30 : https://www.youtube.com/watch?v=w5Emwt3nuV0

export const Profile = () => {
  ///////////////////////////////////////////////////////////////////////////
  //
  // ⚠️ Gotcha: Hydration mismatches can occur on manual browser refresh when implementing authClient.useSession()
  //
  //   https://github.com/better-auth/better-auth/pull/2776
  //   https://github.com/better-auth/better-auth/issues/2462
  //   https://github.com/better-auth/better-auth/issues/960
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
  // Generally, prefer server components with getServerSession(). However, this Next.js
  // app is using cacheComponents:true, which prohibits render blocking and makes getting
  // server sessions a worse user experience. On the other hand, client sessions are generally
  // immediate because of the nanostore.
  //
  // Solution 4: Using dynamic() :
  //
  //   import dynamic from 'next/dynamic'
  //   export const DynamicProfile = dynamic(() => import('./').then((module) => module.Profile), { ssr: false })
  //
  /////////////////////////
  //
  // Refreshing authClient.useSession()
  //
  // By default, authClient.useSession() is stored in the nanostore on app mount.
  // It seems to update itself when one calls authClient.updateUser( ... ) in UpdateUserForm.
  //
  // However, it DOES NOT automatically refresh itself when calling authClient.changeEmail( ... )
  // from within UpdateEmailForm. Why not? In the latter case, the app does not update the
  // email until after the user has gone into their email account and clicked the verification link.
  // At that point, the email redirects to the app in a new browser tab. This means that the original
  // tab where the user initiated the email change from has essentially been abandoned and seems
  // to have no mechanism to know if/when the user has successfully verified their email. Consequently,
  // it will be stuck with the old session data. Solution: revalidate the client session whenever
  // the window refocuses:
  //
  //   const windowFocused = useWindowFocus()
  //   React.useEffect(() => {
  //     if (windowFocused) { refetch() }
  //   }, [refetch, windowFocused])
  //
  // Rather than doing it here, we can do it in AppContext.tsx -> AppProvider.
  // That way, we know for sure it will get applied across the entire app, rather
  // than hoping that the user will revisit the page where this component is located.
  //
  ///////////////////////////////////////////////////////////////////////////

  const value = authClient.useSession()

  const { data, error, isPending /* refetch, isRefetching */ } = value
  const currentName = data?.user?.name || ''
  const currentEmail = data?.user?.email || ''

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

    return (
      <>
        <UpdateUserForm currentName={currentName} />
        <UpdateEmailForm currentEmail={currentEmail} />

        {/* 
        //# If a user has no 'credential' account, attempting to update the password will result in an error.
        //# Rather than allowing the UpdatePasswordForm to be shown, it would be better to check
        //# authClient.listAccounts() for a credential account (see LinkAccounts/index.tsx)
        */}
        <UpdatePasswordForm />
      </>
    )
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
