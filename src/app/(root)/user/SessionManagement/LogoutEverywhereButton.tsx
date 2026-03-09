'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'

import { authClient } from '@/lib/auth-client'
import { toast } from 'sonner'
import { Button } from '@/components'
import { cn } from '@/utils'

type LogoutEverywhereButton = React.ComponentProps<typeof Button>

/* ========================================================================

======================================================================== */
// https://github.com/codinginflow/better-auth-tutorial/blob/final-project/src/app/(main)/profile/logout-everywhere-button.tsx
// This will log the user out on all devices. It destroys all the sessions, and is
// an important security feature.
// To test this, open an icognito browser tab and log in with the same user/account.

export const LogoutEverywhereButton = ({ className = '', ...otherProps }: LogoutEverywhereButton) => {
  const router = useRouter()
  const [pending, setPending] = React.useState(false)

  /* ======================

  ====================== */

  const handleLogoutEverywhere = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault()

    setPending(true)

    try {
      // https://better-auth.com/docs/concepts/session-management#revoke-all-sessions
      const { data, error } = await authClient.revokeSessions()

      if (error) {
        toast.error('Unable to log out everywhere.')
        return
      }

      if (data) {
        toast.success('Logged out from all devices')
        router.push('/login')
        return
      }
    } catch (_err) {
      toast.error('Unable to log out everywhere.')
    } finally {
      setPending(false)
    }
  }

  /* ======================
          return
  ====================== */

  return (
    <Button
      {...otherProps}
      className={cn('flex w-full', className)}
      loading={pending}
      onClick={handleLogoutEverywhere}
      variant='warning'
    >
      {pending ? 'Logging Out...' : 'Log Out Everywhere'}
    </Button>
  )
}
