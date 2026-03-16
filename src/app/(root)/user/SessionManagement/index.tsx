import { Suspense } from 'react'
import { headers } from 'next/headers'

import { SessionLogoutButton } from './SessionLogoutButton'
import { LogoutEverywhereButton } from './LogoutEverywhereButton'
import { auth } from '@/lib/auth'
import { getServerSession } from '@/utils'

/* ========================================================================

======================================================================== */
// WDS at 2:16:15 : https://www.youtube.com/watch?v=WPiqNDapQrk
// He uses ua-parser-js to get the user agent info.
// I did not do all that for this project, but if you want to show a more
// production-grade UI for some other project, then revisit that tutorial.

///////////////////////////////////////////////////////////////////////////
//
//  If you were in a client component, you could do this:
//
// React.useEffect(() => {
//   authClient
//     .listSessions()
//     .then((result) => {
//       // Save to state...
//       return result
//     })
//     .catch((err) => err)
// }, [])
//
///////////////////////////////////////////////////////////////////////////

const SessionManagement = async () => {
  // This has an internal try/catch. Additionally, auth.api.getSession(() itself
  // will merely return null if there's no authenticated user session.
  const session = await getServerSession()
  let sessions = null

  try {
    // If you tried to call this when there was no authenticates user, then
    // it would throw an error. For this reason, it's best to wrap it in a try/catch.
    sessions = await auth.api.listSessions({ headers: await headers() })
  } catch (_err) {
    if (_err instanceof Error) {
      // { message: 'Unauthorized', name: 'APIError' }
      //console.log('Error getting sessions:', { message: _err.message, name: _err.name })
    }
  }

  const currentSessionToken = session?.session?.token

  if (!Array.isArray(sessions) || sessions.length === 0) {
    return <div className='text-primary my-12 text-center text-4xl font-black'>No Server Sessions</div>
  }

  return (
    <>
      <div className='bg-card rounded-lg border shadow'>
        <h3 className='mx-4 mt-4 text-lg font-medium'>Sessions:</h3>
        {sessions.map((item) => {
          const isCurrentSession = item.token === currentSessionToken

          return (
            <div key={item.token} className='relative'>
              {!isCurrentSession && <SessionLogoutButton sessionToken={item.token} />}

              <pre className='overflow-scroll p-4'>
                {isCurrentSession ? (
                  <span className='font-bold text-green-500'>Current Session:</span>
                ) : (
                  <span className='font-bold'>Other Session:</span>
                )}
                {JSON.stringify(item, null, 2)}
              </pre>
            </div>
          )
        })}
      </div>

      <LogoutEverywhereButton />
    </>
  )
}

export const SessionManagementWithSuspense = async () => {
  // Could add Spinner, Skeleton loader, etc.
  return (
    <Suspense fallback={<div className='text-primary my-12 text-center text-4xl font-black'>Loading...</div>}>
      <SessionManagement />
    </Suspense>
  )
}

export { SessionManagementWithSuspense as SessionManagement }
