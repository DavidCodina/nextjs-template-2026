'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { TriangleAlert } from 'lucide-react'

import { authClient } from '@/lib/auth-client'
import { toast } from 'sonner'
import { Button } from '@/components'
import { cn } from '@/utils'

type DeleteUserButtonProps = React.ComponentProps<typeof Button>

/* ========================================================================

======================================================================== */
// WDS at 2:35:30 : https://www.youtube.com/watch?v=WPiqNDapQrk
// Todo: Add a confirmation step to this. In auth.ts do implement: sendDeleteAccountVerification

export const DeleteUserButton = ({ className = '', ...otherProps }: DeleteUserButtonProps) => {
  const router = useRouter()
  const [pending, setPending] = React.useState(false)

  /* ======================

  ====================== */

  const handleDeleteUser = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault()

    const confirmed = window.confirm('Are you sure you want to delete this user? This action cannot be undone.')
    if (!confirmed) {
      return
    }

    setPending(true)

    try {
      // https://better-auth.com/docs/concepts/users-accounts#delete-user
      const { data, error } = await authClient.deleteUser({
        // This is only used when sendDeleteAccountVerification is implemented in auth.ts
        callbackURL: '/register?account_deleted=true'
      })

      if (error) {
        toast.error('Unable to delete account.')
        return
      }

      if (data) {
        // {success: true, message: 'User deleted'}
        toast.success('Account deleted')
        router.push('/register?account_deleted=true')
        return
      }
    } catch (_err) {
      toast.error('Unable to delete account.')
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
      leftSection={<TriangleAlert />}
      loading={pending}
      onClick={handleDeleteUser}
      variant='destructive'
    >
      {pending ? 'Deleting Account...' : 'Permanently Delete Account '}
    </Button>
  )
}
