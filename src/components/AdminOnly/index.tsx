'use client'

import * as React from 'react'
import { authClient } from '@/lib/auth-client'

/* ========================================================================

======================================================================== */
// Similar to the Clerk <Protect /> : https://clerk.com/docs/components/protect
// See also Code with Antonio at 6:34:30 of : https://www.youtube.com/watch?v=1MTyCvS05V4&t=1s
// He creates a client component called RoleGate that is used as a wrapper around other
// comnponents. That component either returns children or an Alert message.

export const AdminOnly = ({ children }: { children: React.ReactNode }) => {
  const value = authClient.useSession()
  const { data /*, error, isPending, isRefetching, refetch  */ } = value
  const isAdmin = data && data.user && typeof data.user.role === 'string' && data.user.role.toLowerCase() === 'admin'

  return isAdmin ? children : null
}
