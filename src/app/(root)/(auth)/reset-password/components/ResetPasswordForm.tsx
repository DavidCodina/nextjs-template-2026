'use client'

import * as React from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { toast } from 'sonner'
import { AlertCircle } from 'lucide-react'

import { authClient } from '@/lib/auth-client'
import { Alert, Button, Input } from '@/components'

/* ========================================================================

======================================================================== */
//# Add confirm password field.
//# Switch to using InputPassword component.

const ResetPasswordForm = () => {
  const router = useRouter()
  // ⚠️ When implementing useSearchParams(), it's generally recommended to wrap in Suspense.
  const searchParams = useSearchParams()
  const token = searchParams.get('token') || ''

  const [newPassword, setNewPassword] = React.useState('')
  const [pending, startTransition] = React.useTransition()

  /* ======================

  ====================== */

  const handleResetPassword = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault()
    if (!newPassword || typeof newPassword !== 'string') {
      toast.error('Email is required.')
      return
    }

    // A missing token is already handled by what UI is show. Doing it here also is still a good practice.
    if (!token || typeof token !== 'string') {
      toast.error('A token is required.')
      return
    }

    if (newPassword.length < 8) {
      toast.error('Password must be at least 8 characters.')
      return
    }

    startTransition(async () => {
      try {
        const { data, error } = await authClient.resetPassword({
          newPassword,
          token
        })

        if (error) {
          // Example: if we did this: http://localhost:3000/reset-password?token=abc123
          // Then we'd get back: {message: 'Invalid token', code: 'INVALID_TOKEN', status: 400, statusText: 'BAD_REQUEST'}
          console.log(error)
          const errorMessage = typeof error.message === 'string' ? error.message : 'Unable to reset password.'
          toast.error(errorMessage, {
            // duration: Infinity
          })

          return
        }
        if (data) {
          toast.success('Password reset success.')
          router.push('/login')
          return
        }
      } catch (_err) {
        toast.error('Unable to reset password.')
      } finally {
        setNewPassword('')
      }
    })
  }

  /* ======================
          return
  ====================== */

  return (
    <>
      {token ? (
        <form
          onSubmit={(e) => e.preventDefault()}
          className='bg-card mx-auto mb-2 max-w-lg overflow-hidden rounded-lg border shadow'
          noValidate
        >
          <div className='space-y-4 p-4'>
            <Input
              label='New Password'
              labelRequired
              autoComplete='off'
              name='new_password'
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder='New Password...'
              spellCheck={false}
              type='password'
              value={newPassword}
            />

            <Button className='flex w-full' loading={pending} onClick={handleResetPassword}>
              {pending ? 'Resetting Password...' : 'Reset Password'}
            </Button>
          </div>
        </form>
      ) : (
        <Alert
          leftSection={<AlertCircle className='size-6' />}
          title={'Error'}
          variant={'destructive'}
          className='mx-auto my-6 max-w-[800px]'
        >
          The token for the reset link is missing or invalid. Make sure you received the email with the reset password
          link.
        </Alert>
      )}
    </>
  )
}

const ResetPasswordFormWithSuspense = () => {
  return (
    <React.Suspense>
      <ResetPasswordForm />
    </React.Suspense>
  )
}

export { ResetPasswordFormWithSuspense as ResetPasswordForm }
