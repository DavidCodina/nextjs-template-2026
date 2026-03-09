import { Suspense } from 'react'
import { getServerSession } from '@/utils'

/* ========================================================================

======================================================================== */

const ServerSession = async () => {
  const session = await getServerSession()

  if (!session) {
    return <div className='text-primary my-12 text-center text-4xl font-black'>No Server Session</div>
  }

  return (
    <div className='mx-auto mb-6 max-w-[800px]'>
      <h2 className='text-primary mb-1 text-4xl font-black'>Server Session</h2>
      <pre className='bg-card overflow-scroll rounded-lg border p-4 shadow'>{JSON.stringify(session, null, 2)}</pre>
    </div>
  )
}

///////////////////////////////////////////////////////////////////////////
//
// While this works, it means that it will always blink in with the fallback.
//
// That said, if we set sesssion.cookieCache in auth.ts that issue could be mitigated.
// However, the Better Auth cache only works for the first cycle after login.
// It's not renewed with subsequent calls to get the server session.
// Unfortunately, refreshCache seems to be broken at the moment.
//
// Ultimately, the use of cacheComponents is a bad idea.
// It created more problems than it solved.
// Docs: How to intentionally block in Cache Components?
// https://github.com/vercel/next.js/issues/86739

// cacheComponents is not mature enough yet to handle these scenarios.
// I would not recommend using cacheComponents in production until there are genuine solutions.
// That said, for this project, I'm still using them, so I can keep up on what's new and premptively
// familiarize myself with the current gotchas.
//
///////////////////////////////////////////////////////////////////////////
export const ServerSessionWithSuspense = async () => {
  // Could add Spinner, Skeleton loader, etc.
  return (
    <Suspense fallback={<div className='text-primary my-12 text-center text-4xl font-black'>Loading...</div>}>
      <ServerSession />
    </Suspense>
  )
}

export { ServerSessionWithSuspense as ServerSession }

// return (
//   <div className='mx-auto mb-6 max-w-[800px]'>
//     <h2 className='text-primary mb-1 text-4xl font-black'>Server Session</h2>
//     <div className='bg-card rounded-lg border shadow'>
//       {image && (
//         <img
//           alt=''
//           src={session.user?.image as string}
//           className='mx-auto mt-4 block w-full max-w-[150px] rounded-lg border shadow'
//         />
//       )}
//       <pre className='overflow-scroll p-4'>{JSON.stringify(session.user, null, 2)}</pre>
//     </div>
//   </div>
// )
