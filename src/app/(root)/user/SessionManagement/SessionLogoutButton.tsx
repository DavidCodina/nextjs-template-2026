'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'

import { Trash2 } from 'lucide-react'

import { authClient } from '@/lib/auth-client'
import { toast } from 'sonner'
import { Button } from '@/components'
import { cn } from '@/utils'

type SessionLogoutButtonProps = React.ComponentProps<typeof Button> & {
  sessionToken: string
}

/* ========================================================================

======================================================================== */

export const SessionLogoutButton = ({ className = '', sessionToken = '', ...otherProps }: SessionLogoutButtonProps) => {
  const router = useRouter()
  const [pending, setPending] = React.useState(false)

  /* ======================

  ====================== */

  const handleRevokeSession = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault()

    setPending(true)

    try {
      // https://better-auth.com/docs/concepts/session-management#revoke-session
      const { data, error } = await authClient.revokeSession({
        token: sessionToken
      })

      if (error) {
        toast.error(`Unable to revoke session: ${sessionToken}`)
        return
      }

      if (data) {
        toast.success(`Session revoked: ${sessionToken}`)
        // In this case the sessions were obtained through the server-side API in the parent component:
        // const sessions = await auth.api.listSessions({ headers: await headers() })
        // That data is now stale. In order to get fresh sessions data, refresh the page
        router.refresh()
        return
      }
    } catch (_err) {
      toast.error(`Unable to revoke session: ${sessionToken}`)
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
      className={cn('absolute top-2 right-2', className)}
      isIcon
      loading={pending}
      onClick={handleRevokeSession}
      title='Log Out Of Session'
      variant='destructive'
    >
      <Trash2 className='size-4' />
    </Button>
  )
}
