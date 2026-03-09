import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import { getServerSession } from '@/utils'

type AuthenticatedProps = {
  children: React.ReactNode
}

/* ========================================================================

======================================================================== */
///////////////////////////////////////////////////////////////////////////
//
// ⚠️ DO NOT USE THIS COMPONENT!
//
// While this solution works and will protect any content rendered as children,
// it's also bad UX because in Next.js 16, we either cache or use Suspense.
// We definitely don't want to use caching here, so that means we'll be using
// Suspense. With a Suspense wrapper, the content will always blink in, which
// is horrible!
//
// Additionally, protecting UI is merely a superficial check. Developers may still
// create components that need protection, but accidentally consume them outside of
// <Authenticated />. The real solution is to use proxy.ts for optimisitic checks in
// conjunction with a strong Data Access Layer (DAL).
//
// Is it bad to do authentication/authorization in proxy.ts? No. Not if you treat is as
// an optimistic check. This means it should be considered as if it’s for UX only. It’s
// more of a superficial check, intended for snappy UI.
//
// Authentication/Authorization checks in proxy.ts should not be treated as the only line of
// defense. If someone managed to bypass proxy.ts, your data would be exposed. This vulnerability
// was acknowledged with CVE-2025-29927, often called the "x-middleware-subrequest header bypass"
// or "Next.js Middleware Authorization Bypass."
//
// This issue highlighted why middleware alone as a security mechanism in Next.js's is not secure.
// middleware.ts or proxy.ts is great for snappy UI, but it should always be used in conjunction
// with a robust Data Access Layer (DAL).
//
//
///////////////////////////////////////////////////////////////////////////

const Authenticated = async ({ children }: AuthenticatedProps) => {
  const session = await getServerSession()

  // ⚠️ This will not trigger redirects after the initial page load.
  // Thus if you sign out using the client-side signOut(), this redirect()
  // will not magically trigger. Why? Because it was on the server.
  if (!session) {
    // console.log('\nThe user is NOT authenticated.\n')

    // Note: In the Coding In Flow tutorial at 32:30 he calls the new Next.js
    // unauthorized() function to redirect to the unauthorized.tsx.
    // This may still require experimental.authInterrupts set to true.
    // However, that's the best UX - just go directly to '/login' instead.
    redirect('/login')
  }

  // console.log('\nThe user is authenticated.\n')

  // This is a textbook example of the doughnut pattern.
  return children
}

const AuthenticatedWithSuspense = async (props: AuthenticatedProps) => {
  return (
    <Suspense fallback={null}>
      <Authenticated {...props} />
    </Suspense>
  )
}

export { AuthenticatedWithSuspense as Authenticated }

/*
# What is "@better-fetch/fetch"?
This is the cleanest solution - handle authentication before the page renders:

// middleware.ts
import { betterFetch } from "@better-fetch/fetch"
import type { Session } from "better-auth/types"
import { NextResponse, type NextRequest } from "next/server"

export default async function authMiddleware(request: NextRequest) {
  const { data: session } = await betterFetch<Session>(
    "/api/auth/get-session",
    {
      baseURL: request.nextUrl.origin,
      headers: {
        cookie: request.headers.get("cookie") || "",
      },
    },
  )

  if (!session) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/user/:path*", "/dashboard/:path*"], // Protected routes
}

*/
