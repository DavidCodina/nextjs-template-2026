'use client'

import * as React from 'react'
import { toast } from 'sonner'

import { linkCredentials } from './linkCredentials'
import { Button, Input } from '@/components'
import { cn } from '@/utils'

type SetPasswordFormProps = {
  className?: string
  onSuccess: () => void
}

/* ========================================================================

======================================================================== */
//# Add confirm password field.
//# Switch to using InputPassword component.

export const LinkCredentialsForm = ({ className = '', onSuccess }: SetPasswordFormProps) => {
  const [newPassword, setNewPassword] = React.useState('')
  const [pending, startTransition] = React.useTransition()

  /* ======================

  ====================== */

  const handleLinkCredentials = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault()
    if (!newPassword || typeof newPassword !== 'string') {
      toast.error('Email is required.')
      setNewPassword('')
      return
    }

    if (newPassword.length < 8) {
      toast.error('Password must be at least 8 characters.')
      setNewPassword('')
      return
    }

    startTransition(async () => {
      try {
        // ⚠️ setPassword can't be called from the client for security reasons.
        const { message, success } = await linkCredentials({
          password: newPassword,
          confirmPassword: newPassword
        })

        if (success !== true) {
          const errorMessage = typeof message === 'string' ? message : 'Unable to set password.'
          toast.error(errorMessage, {
            // duration: Infinity
          })
        } else if (success === true) {
          onSuccess?.()
          toast.success('Password set success.')
        }
      } catch (_err) {
        toast.error('Unable to set password.')
      } finally {
        setNewPassword('')
      }
    })
  }

  /* ======================
          return
  ====================== */

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className={cn('flex max-w-sm flex-wrap items-start gap-2', className)}
      noValidate
    >
      <Input
        groupClassName='flex-1'
        autoComplete='off'
        name='new_password'
        onChange={(e) => setNewPassword(e.target.value)}
        placeholder='New Password...'
        spellCheck={false}
        fieldSize='sm'
        type='password'
        value={newPassword}
      />

      <Button className='flex' loading={pending} onClick={handleLinkCredentials} size='sm' type='button'>
        {pending ? 'Submitting...' : 'Submit'}
      </Button>
    </form>
  )
}
