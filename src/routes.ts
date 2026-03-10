///////////////////////////////////////////////////////////////////////////
//
// An array of routes that are accessible to the public
// These routes do not require authentication. Thus anything
// that is listed here opts-out of protection.
// Note that in the absence this file and the associated middleware
// that uses it, we can also create page specific route protection by
// doing the in the page.tsx:
//
//   import { auth } from 'auth'
//   import { redirect } from 'next/navigation'
//
//   PageTodos async () => {
//     const session = await auth()
//     const user    = session?.user
//     if (!user) { redirect('auth/login?callbackUrl=/todos') }
//   }
//
// Demonstrated here at 56:15 : https://www.youtube.com/watch?v=bMYZSi_LZ2w
// However, he uses the default next-auth login page. If you're using your own
// login implementation you need to get the callbackUrl from the browser.
// For example:
//
//   import { useSearchParams } from 'next/navigation'
//   import { signIn } from 'next-auth/react'
//
//   export const LoginForm = () => {
//     const searchParams = useSearchParams()
//     const callbackUrl = searchParams?.get('callbackUrl')
//     const handleOAuthLogin = /* async */ (provider: 'google' | 'github') => {
//       signIn(provider, {
//         callbackUrl: callbackUrl ? callbackUrl : DEFAULT_LOGIN_REDIRECT
//       }).catch((_err) => {
//         toast.error('Unable to log in.', { autoClose: false })
//       })
//     }
//     // ...
//   }
//
///////////////////////////////////////////////////////////////////////////

export const publicRoutes = [
  '/',
  '/about',
  '/test',
  '/caching',
  '/caching-2',
  '/forbidden',
  '/nonexistent', // Just for testing the not-found.tsx while not logged in.

  // Why is this in publicRoutes? We want the user to be able to change their email
  // from the settings page. Thus, even if they're not logged in, we still want this
  // page to be accessible. If we were to put it in authRoutes, and the user was
  // already logged in (i.e., authenticated) then they would be redirected to
  // DEFAULT_LOGIN_REDIRECT. Why? Because that's how middleware.ts is set up.
  // Consequently, we actually want '/auth/new-verification' to be in publicRoutes.
  '/new-verification'

  // Add public API routes here also, but the preferred approach is to put all public routes in /api/public.
]

/** An array of routes that are used for authentication
 * If user tries to access them while authenticated, they
 * will be redirected to DEFAULT_LOGIN_REDIRECT
 */
export const authRoutes = ['/login', '/register', '/forgot-password', '/reset-password']

// Routes that start with '/api/auth' prefix are used for API authentication purposes.
// Never block the /api/auth routes.
export const apiAuthPrefix = '/api/auth'

export const ADMIN_PREFIX = '/admin'

/** The default redirect path after logging in. */
export const DEFAULT_LOGIN_REDIRECT = '/user' // '/settings', etc
