'use client'

import * as React from 'react'
import { toast } from 'sonner'

import { authClient } from '@/lib/auth-client'
import { Button, Input } from '@/components'

/* ========================================================================

======================================================================== */
// Resetting a password is a two-step process.
// 1. They sumbit their email and then receive a link at that email address.
// 2. They enter a new password, which happens on a separate page.

export const ForgotPasswordForm = () => {
  const [email, setEmail] = React.useState('')
  const [pending, startTransition] = React.useTransition()

  /* ======================

  ====================== */

  const handleForgotPassword = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault()

    //# Switch to Zod validation.
    if (!email || typeof email !== 'string') {
      toast.error('Email is required.')
      return
    }

    startTransition(async () => {
      try {
        // If the email address exists, it sends the reset password email to the user
        // By "exists", we likely mean if it exists in our database.

        const { data, error } = await authClient.requestPasswordReset({
          email: email,

          // Used by the sendResetPassword callback in auth.ts to redirect user back
          // to the application after they click on the link in the associated email.
          redirectTo: '/reset-password'
        })

        if (error) {
          const errorMessage =
            typeof error.message === 'string' ? error.message : 'Unable to send password reset email.'

          toast.error(errorMessage, {
            // duration: Infinity
          })
          return
        }

        if (data) {
          // If no email account exists in the database for the given password,
          // Better Auth will not throw an error. It will simply silently do nothing.
          // Instead, it will always succeed, even if there is no such email in the database.
          // This is an intentional desing decision by Better Auth to be opaque.
          // That's why I added the caveat in the toast.
          // Coding In Flow discusses this  at 1:12:30 : https://www.youtube.com/watch?v=w5Emwt3nuV0
          toast.success('If account exists for associated email, the password reset email was sent.')
          return
        }
      } catch (_err) {
        toast.error('Unable to send password reset email.')
      } finally {
        setEmail('')
      }
    })
  }

  /* ======================
          return
  ====================== */

  return (
    <>
      <form
        onSubmit={(e) => e.preventDefault()}
        className='bg-card mx-auto mb-2 max-w-lg overflow-hidden rounded-lg border shadow'
        noValidate
      >
        <div className='space-y-4 p-4'>
          <Input
            label='Email'
            labelRequired
            autoComplete='off'
            name='email'
            onChange={(e) => setEmail(e.target.value)}
            placeholder='Email...'
            spellCheck={false}
            type='email'
            value={email}
          />

          <Button className='flex w-full' loading={pending} onClick={handleForgotPassword}>
            {pending ? 'Sending Reset Password Email...' : 'Send Reset Password Email'}
          </Button>
        </div>
      </form>
    </>
  )
}
