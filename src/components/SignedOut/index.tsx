'use client'

import * as React from 'react'
import { authClient } from '@/lib/auth-client'

/* ========================================================================

======================================================================== */

export const SignedOut = ({ children }: { children: React.ReactNode }) => {
  const value = authClient.useSession()
  const { data /*, error, isPending, isRefetching, refetch */ } = value

  return !data ? children : null
}
