'use client'

import { useState, useLayoutEffect } from 'react'
/* ========================================================================

======================================================================== */
///////////////////////////////////////////////////////////////////////////
//
// You'd think that because we are implementing the "use client" directive that
// we'd be safe using window. However, that's not true. Why? Because client
// components run once on the server first. Consequently, we STILL need to
// perform conditional checks. What makes this interesting is that certain
// things like useEffect() WILL be opted out on the server when 'use client'.
// Thus we could also just wrap the if logic in a useEffect().
//
// Also if you ONLY ever want it to run on the client, you can import it using
// dynamic from 'next/dynamic'. However, it's probably better to not have to deal
// with that when consuming.
//
///////////////////////////////////////////////////////////////////////////

export const GetWindow = () => {
  const [mounted, setMounted] = useState(false)
  const isWindow = typeof window !== 'undefined'

  // So far so good. This works as one might extpect.
  if (typeof window !== 'undefined') {
    const location = window.location
    console.log({ pathname: location.pathname })
  } else {
    console.log('\n\nNo window...')
  }

  ///////////////////////////////////////////////////////////////////////////
  //
  // However, if you try to conditionally render JSX based on the existence of window,
  // you'll run into the infamous Next.js hydration mismatch error. Again, this happens
  // because despite being a client component, Next.js still executes it once on the server.
  //
  //   ❌ on-recoverable-error.js:28 Uncaught Error: Hydration failed because
  //   the server rendered HTML didn't match the client.
  //
  //   return (
  //     <>
  //       {isWindow && (
  //         <div className='tesxt-center text-2xl font-bold'>{window.location.pathname}</div>
  //       )}
  //     </>
  //   )
  //
  // Consequently, we need to actually defer the rendering of browser specific content
  // until it's truly on the client.
  //
  ///////////////////////////////////////////////////////////////////////////

  //  useLayoutEffect() is the appropriate choice here to run before after render and before paint.
  useLayoutEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return <>{isWindow && <div className='tesxt-center text-2xl font-bold'>{window.location.pathname}</div>}</>
}
