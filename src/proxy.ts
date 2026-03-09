// https://authjs.dev/reference/nextjs#in-middleware
// https://nextjs.org/docs/app/building-your-application/routing/middleware

///////////////////////////////////////////////////////////////////////////
//
// Gotcha: middleware runs before the next-auth callbacks, so
// we won't have access to the extended user. This means we would
// have to interact with the database here in order to get role,
// and do admin protection logic. However, you can't interact with
// the database in middleware.
//
// Or can you? Normally, you would see an error in the console,
// even in development:
//
//   Error: PrismaClient is not configured to run in Vercel Edge Functions or Edge Middleware.
//
// In the following ByteGrad tutorial at 1:12:00 https://www.youtube.com/watch?v=QXxy8Uv1LnQ ,
// he shows how to make this possible using a driver adapter, and I believe that's what we're
// doing when we set up our custom PrismaClient.

// Mahmoud also discusses the serverless driver and it's Edge capabilities in
// Serverless Postgres at 43:30: https://www.youtube.com/watch?v=RaO9m8a_3ug&t=2101s
//
//^ If this is true, then it means that prisma can be used here as well as in the
//^ CredentialsProvider when CredentialsProvider is inside of auth.config.ts.
//# As a first step, try making a random db call here to see what happens.
//
// The alternative would be to create a layout.tsx that wraps all
// admin pages, and performs the necessary roles-based authentication.
//
// Code with Antonio does an admin example here at 6:30:00 :
// https://www.youtube.com/watch?v=1MTyCvS05V4&t=1s
// It's important to note that his tutorial is the one that was advocating
// in favor of using middleware for route protection, and he still does this
// locally in an admin page:
//
//   const session = await auth()
//   const user    = session?.user
//   const isAdmin = user && user?.roles?.includes('admin')
//   if (!isAdmin) { redirect('/forbidden') }
//
///////////////////////////////////////////////////////////////////////////

import { NextResponse, NextRequest } from 'next/server'
import { headers } from 'next/headers'
import { auth } from '@/lib/auth'

import { DEFAULT_LOGIN_REDIRECT, apiAuthPrefix, authRoutes, publicRoutes, ADMIN_PREFIX } from './routes'

/* ========================================================================

======================================================================== */
///////////////////////////////////////////////////////////////////////////
//
// This app will be protected by default.
// Why? Because you generally have fewer public routes than private routes.
// See Code With Antonio at 2:17:00 : https://www.youtube.com/watch?v=1MTyCvS05V4&t=1s
//
/////////////////////////
//
// https://authjs.dev/guides/edge-compatibility
// By default, on Vercel and other hosting providers, Middleware code always runs in an edge runtime.
// TL;DR: We need to separate out parts of auth.ts into auth.config.ts.
//
///////////////////////////////////////////////////////////////////////////
export async function proxy(req: NextRequest) {
  ///////////////////////////////////////////////////////////////////////////
  //
  // Less secure alternative:
  //
  //   const sessionCookie = getSessionCookie(request);
  //   if (!sessionCookie) { return NextResponse.redirect(new URL("/", request.url)); }
  //
  // Trade-off: Cookie-only checks are faster (no database query) but expose you to session
  // hijacking, inability to force logouts, and stale session access. The performance gain
  // is minimal compared to the security risk for most applications.
  //
  ///////////////////////////////////////////////////////////////////////////
  const session = await auth.api.getSession({
    headers: await headers()
  })

  // console.log('\n\n------------------------------------------------------')
  // console.log(session)
  // console.log('------------------------------------------------------\n\n')

  const { nextUrl } = req
  const isLoggedIn = !!session

  const isAuthRoute = authRoutes.includes(nextUrl.pathname)
  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix) // '/api/auth'

  const isAdminRoute = nextUrl.pathname.startsWith(ADMIN_PREFIX)

  const isPublicRoute =
    publicRoutes.includes(nextUrl.pathname) ||
    // ⚠️ This kind of hack would actually end up being a pain in production.
    // nextUrl.pathname.startsWith('/api/dynamic-route-demo')
    // A better solution is to actually have an /api/public folder.
    nextUrl.pathname.startsWith('/api/public')

  // If it's an API auth route, then always allow it. This
  // entails any route that begins with '/api/auth'.
  if (isApiAuthRoute) {
    return
  }

  if (isAuthRoute) {
    // However, if the user is already logged in, then there's no reason for them
    // to be accessing an auth route, so redirect to DEFAULT_LOGIN_REDIRECT.

    if (isLoggedIn) {
      // Don't use Response.redirect() here. It will result in: ⨯ TypeError: immutable
      // Response.redirect() creates an immutable response — when Next.js tries to attach
      // its internal headers to it, it throws TypeError: immutable.
      return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl))
    }
    return
  }

  /* ======================
      rewrite() Demo
  ====================== */

  // This is an example of a rewrite. The route '/api/public/whuddup' is NOT actually
  // in the /api/public directory. However, the  '/api/public/hello' route is. Thus,
  // placing the logic here allows us to handle the rewrite BEFORE the middleware would
  // otherwise flag it as 'Not authorized' for users who are not logged in.

  // if (nextUrl.pathname === '/api/public/whuddup') {
  //   // ⚠️ Gotcha: It seems that when using rewrite(), we must pass the full URL.
  //   // ❌ return NextResponse.rewrite('/api/public/hello')
  //   return NextResponse.rewrite('http://localhost:3000/api/public/hello')
  // }

  ///////////////////////////////////////////////////////////////////////////
  //
  // In theory, you could also use rewrite() for third-party/external APIs. However, this is discouraged.
  // Middleware NextResponse.rewrite() is designed for internal routing within your Next.js app.
  // While it might work for external URLs in some cases, it's not the intended use case and can be unreliable.
  // For third-party or external APIs, prefer a proxy approach.
  //
  //   export async function GET(_req: Request) {
  //     const response = await fetch('https://jsonplaceholder.typicode.com/todos?_limit=5')
  //     const data     = await NextResponse.json()
  //     return NextResponse.json(data)
  //   }
  //
  ///////////////////////////////////////////////////////////////////////////

  // if (nextUrl.pathname === '/api/public/get-todos') {
  //   return NextResponse.rewrite('https://jsonplaceholder.typicode.com/todos?_limit=5')
  // }

  /* ======================

  ====================== */

  // If the user is NOT logged in and the route is NOT public, then...
  // Code With Antionio at 2:35:00.

  if (!isLoggedIn && !isPublicRoute) {
    // https://authjs.dev/getting-started/session-management/protecting?framework=express#nextjs-middleware
    // With Next.js 12+, the easiest way to protect a set of pages is using the middleware file.
    if (nextUrl.pathname.startsWith('/api')) {
      return new Response(
        JSON.stringify({
          data: null,
          message: 'Not authorized.',
          success: false
        }),
        {
          status: 401,
          headers: {
            'Content-Type': 'application/json; charset=utf-8',
            'Cache-Control': 'no-store'
          }
        }
      )
    }

    if (nextUrl.search) {
      ///////////////////////////////////////////////////////////////////////////
      //
      // When signing out, 'logout=true' is set in the query string.
      // This is set in AppSidebar's 'Sign Out' button:
      //
      //   onClick={() => {
      //     const searchParams = new URLSearchParams(window.location.search)
      //     searchParams.set('logout', 'true')
      //     window.history.replaceState(null, '',`?${searchParams.toString()}`)
      //     signOut({ redirect: true })
      //   }}
      //
      // We can use the presence of this search param to opt out of assiging a callbackUrl.
      //
      // When you’re performing a redirect within the middleware, including nextUrl as the base in the new URL()
      // constructor ensures that the redirect maintains the same host and protocol as the original request.
      // This has the added benefit of preventing public routes from being used as callbackUrls.
      // Why? Because users are never redirected to '/login' from a public route.
      //
      ///////////////////////////////////////////////////////////////////////////

      if (nextUrl.search.includes('logout=true')) {
        return NextResponse.redirect(new URL(`/login`, nextUrl))
      }
    }

    // This is the logic for automatically assigning the callbackUrl.
    const callbackUrl = nextUrl.pathname
    const encodedCallbackUrl = encodeURIComponent(callbackUrl)

    const otherSearchParams = nextUrl.search ? `&${nextUrl.search.slice(1)}` : ''

    return NextResponse.redirect(new URL(`/login?callbackUrl=${encodedCallbackUrl}${otherSearchParams}`, nextUrl))
  }

  /* ======================
        Admin Check
  ====================== */
  // At this point, one of two cases may be true:
  // - A valid session does not exist and user is on a public route.
  // - A valid session exists and the user is on a non-public route.
  // In the latter case, we want to enforce RBAC for admins.

  if (isLoggedIn && isAdminRoute) {
    const role = typeof session.user?.role === 'string' ? session.user.role : ''
    if (role.toLocaleLowerCase() !== 'admin') {
      return NextResponse.redirect(new URL('/forbidden', nextUrl))
    }
  }

  /* ======================

  ====================== */

  // Otherwise, return.
  return
}

export const config = {
  // https://clerk.com/docs/quickstarts/nextjs?utm_medium=youtube&utm_source=sponsorship&utm_content=12-31-2023&utm_campaign=code-with-antonio#require-authentication-to-access-your-app
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)'
  ]
}
