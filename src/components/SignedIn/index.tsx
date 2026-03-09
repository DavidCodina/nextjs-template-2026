'use client'

import * as React from 'react'
import { authClient } from '@/lib/auth-client'

/* ========================================================================

======================================================================== */
// You don't need a SessionProvider with Better Auth!
// This is actually one of the nice improvements over Auth.js v5.

export const SignedIn = ({ children }: { children: React.ReactNode }) => {
  const value = authClient.useSession()
  const { data /*, error, isPending, isRefetching, refetch  */ } = value
  // console.log('data from signed in: ', data)

  return data ? children : null
}
