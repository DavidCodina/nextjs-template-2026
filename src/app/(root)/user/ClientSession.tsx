'use client'

import { authClient } from '@/lib/auth-client'

/* ========================================================================

======================================================================== */

export const ClientSession = () => {
  // If you prefer not to use the hook, you can use the getSession method
  // provided by authClient: await authClient.getSession()
  // Obviously, this would probably need to be done inside a useEfffect, or
  // passed into a client component wrapped in Suspense.

  ///////////////////////////////////////////////////////////////////////////
  //
  // The value seems to come back immediately with data.session, data.user, and isPending as false.
  // This may be because it's already stored in a nanostore.
  // However, if you navigate from a different URL directly to http://localhost:3000/user
  // Or if you just refresh the browser, then you WILL see this:
  //
  //   1. {data: null, error: null, isPending: true}
  //   2. {data: {…}, error: null, isPending: false}
  //
  // If there's no sesssion then there's no error. You just get back:
  //
  //  { data: null, error: null, isPending: false, isRefetching: false, refetch: (queryParams)=>fn(queryParams) }
  //
  ///////////////////////////////////////////////////////////////////////////
  const value = authClient.useSession()
  // Here data is the full session of session.session and session.user.
  //
  // Note: here data and error seem not to exist as a discriminated union in regard
  // to their types. However, I'm assuming that in practice they never coexist.
  const { data, error, isPending /*, isRefetching, refetch */ } = value

  ///////////////////////////////////////////////////////////////////////////
  //
  // ⚠️ Gotcha: This will happen ONLY if you do console.log(data).
  // It wont't happen if you do console.dir(data).
  //
  //   ❌ Route "/user" used Date.now() inside a Client Component without a Suspense boundary above it.
  //
  // Why does this happen? It seems to be the result of React DevTools.
  // If you render this in JSX <pre>{String(console.log)}</pre>, you get this:
  //
  //   (...t)=>{const n=m.settings;null!=n?n.hideConsoleLogsInStrictMode||(n.disableSecondConsoleLogDimmingInStrictMode?e(...t):e(v,...formatConsoleArguments(...t))):e(...t)}
  //
  // It’s minified code, and the setting names in it come from React DevTools.
  // Note: Here we're not talking about the Chrome browser extension.
  // Rather, it's coming from somewhere withing the React or Next.js bundle.
  // It’s the Strict Mode logging feature. In dev, React renders each component twice, and DevTools grays
  // out (or hides) logs from the second render so you don’t see duplicates.
  // To do that, it replaces console.log with this wrapper.
  // This is probably a feature and not a bug. The Terminal output suggests a fix:
  //
  //   Move the read into a `useEffect` or event handler
  //
  // See here for a general discussion on why the Date.now() errro: https://github.com/vercel/next.js/issues/76569
  //
  //
  ///////////////////////////////////////////////////////////////////////////

  /* ======================
      renderContent()
  ====================== */

  const renderContent = () => {
    if (error) {
      return <div className='text-destructive my-12 text-center text-4xl font-black'>An error occurred.</div>
    }

    if (isPending) {
      // Todo: Add loading UI.
      return <div className='text-primary my-12 text-center text-4xl font-black'>Loading...</div>
    }

    if (!data) {
      return <div className='text-destructive my-12 text-center text-4xl font-black'>No Client Session.</div>
    }

    return (
      <>
        <pre>{String(console.log)}</pre>

        <div className='mx-auto mb-6 max-w-200'>
          <h2 className='text-primary mb-1 text-4xl font-black'>Client Session</h2>
          <pre className='bg-card overflow-scroll rounded-lg border p-4 shadow'>{JSON.stringify(data, null, 2)}</pre>
        </div>
      </>
    )
  }

  /* ======================
          return
  ====================== */

  return renderContent()
}
