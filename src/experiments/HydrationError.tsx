'use client'

/* ========================================================================

======================================================================== */

///////////////////////////////////////////////////////////////////////////
//
// See ByteGrad around 32:00 : https://www.youtube.com/watch?v=5QP0mvrJkiY&t=16s
//
//  Error: Text content does not match server-rendered HTML.
//  See more info here: https://nextjs.org/docs/messages/react-hydration-error
//
// Essentially, Next.js will complain that the HTML that was first rendered
// on the server does not match what is now being rendered on the client,
// i.e., react-hydration-error
//
// Essentially, it's a warning to us to check if we made a mistake. In this
// case, we didn't make a mistake. Another common scenario is when we need to
// use new Date().
//
// <p><div>...</div></p> also would cause a hydration error because we're
// using incorrect HTML structure.
//
///////////////////////////////////////////////////////////////////////////

export const HydrationError = () => {
  const isWindow = typeof window !== 'undefined'

  return (
    <div>
      {isWindow ? (
        <div
          className='my-6 text-center text-3xl font-black text-green-500'
          // Ensure that the suppressHydrationWarning attribute is placed directly on the element
          // that is causing the hydration warning.
          //
          // suppressHydrationWarning works correctly, but if we manually
          // refresh the browser, isWindow is still reflecting the value from the server.
          // I suspect this issue only occurs because the development server reboots
          // when you do the refresh.
          suppressHydrationWarning
        >
          window detected
        </div>
      ) : (
        <div className='my-6 text-center text-3xl font-black text-red-500'>window not detected</div>
      )}
    </div>
  )
}
