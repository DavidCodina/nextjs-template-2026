'use client'

import * as React from 'react'
import { toast } from 'sonner'

import { authClient } from '@/lib/auth-client'
import { setPassword } from './setPassword'
import { Button, Input } from '@/components'
import { cn } from '@/utils'

type SetPasswordFormProps = {
  className?: string
}

/* ========================================================================

======================================================================== */
//# Add confirm password field.
//# Switch to using InputPassword component.

//# Rather than showing SetPasswordForm with disclaimer when a credentials account exists,
//# we should just not show the form at all.

export const LinkCredentialsForm = ({ className = '' }: SetPasswordFormProps) => {
  const [newPassword, setNewPassword] = React.useState('')
  const [pending, startTransition] = React.useTransition()

  const [_loadingAccounts, setLoadingAccounts] = React.useState(true)
  const [hasCredentials, setHasCredentials] = React.useState<boolean | null>(null)

  /* ======================

  ====================== */

  const handleSetPassword = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault()
    if (!newPassword || typeof newPassword !== 'string') {
      toast.error('Email is required.')
      return
    }

    if (newPassword.length < 8) {
      toast.error('Password must be at least 8 characters.')
      return
    }

    startTransition(async () => {
      try {
        // ⚠️ setPassword can't be called from the client for security reasons.
        const { message, success } = await setPassword({
          password: newPassword,
          confirmPassword: newPassword
        })

        if (success !== true) {
          const errorMessage = typeof message === 'string' ? message : 'Unable to set password.'
          toast.error(errorMessage, {
            // duration: Infinity
          })

          return
        }

        toast.success('Password set success.')
      } catch (_err) {
        toast.error('Unable to set password.')
      } finally {
        setNewPassword('')
      }
    })
  }

  /* ======================
          useEffect()
  ====================== */

  React.useEffect(() => {
    setLoadingAccounts(true)
    authClient
      .listAccounts()
      .then((result) => {
        const { data } = result

        const credentialAccount = data?.find((account) => account.providerId === 'credential')
        setHasCredentials(!!credentialAccount)

        return result
      })
      .catch((err) => err)
      .finally(() => {
        setLoadingAccounts(false)
      })
  }, [])

  /* ======================

  ====================== */

  const renderDisclaimer = () => {
    if (hasCredentials === null) {
      return null
    }

    if (hasCredentials === true) {
      return (
        <div className='mb-2 text-sm'>
          <span className='text-primary font-bold'>Note:</span> You currently have an existing credentials account.
          Updating the password will permanently change the email/password login credentials.
        </div>
      )
    }

    return (
      <div className='mb-2 text-sm'>
        <span className='text-primary font-bold'>Note:</span> You currently{' '}
        <span className='text-primary font-bold italic'>DO NOT</span> have an existing credentials account. Setting the
        password here allows you to also sign in with email/password against the email already on record.
      </div>
    )
  }

  /* ======================
          return
  ====================== */

  return (
    <>
      {renderDisclaimer()}
      <form
        onSubmit={(e) => e.preventDefault()}
        className={cn('bg-card rounded-lg border shadow', className)}
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

          <Button className='flex w-full' loading={pending} onClick={handleSetPassword}>
            {pending ? 'Setting Password...' : 'Set Password'}
          </Button>
        </div>
      </form>
    </>
  )
}
