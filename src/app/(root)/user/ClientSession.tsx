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
  // Gotcha: This will happen ONLY if you log data:
  //
  //   ❌ Route "/user" used Date.now() inside a Client Component without a Suspense boundary above it.
  //
  // This may be a subtle interaction between Next.js 16's prerendering behavior, Better Auth's internals,
  // and how JavaScript evaluates object properties. Better Auth's useSession() almost certainly calls Date.now()
  // internally — most likely to check whether the cached session token is still valid/expired. However,
  // the session object returned by useSession() likely uses lazy getter properties — properties that are only
  // computed (and thus only call Date.now()) when they are actually accessed.

  //
  // This behavior ultimately stems from setting cacheComponents:true, which you can opt out of.
  // That said, it's also the direction that Next.js is moving in. Thus, using the new Partial
  // Prerendering (PPR) model enforces that anything "dynamic" (including Date.now() calls
  // from third-party libraries) must be either wrapped in <Suspense> or marked with use cache.
  //
  //   <Suspense>
  //     <ClientSession />
  //   </Suspense>
  //
  // See here for an explanation from gnoff: https://github.com/vercel/next.js/issues/76569
  // That issue mentions how they expect third-party libraries to adapt so that hopefully in
  // the future there will be less need for the end user to have to fix it.
  //
  // https://github.com/prisma/prisma/issues/28588
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
      <div className='mx-auto mb-6 max-w-[800px]'>
        <h2 className='text-primary mb-1 text-4xl font-black'>Client Session</h2>
        <pre className='bg-card overflow-scroll rounded-lg border p-4 shadow'>{JSON.stringify(data, null, 2)}</pre>
      </div>
    )
  }

  /* ======================
          return
  ====================== */

  return renderContent()
}
