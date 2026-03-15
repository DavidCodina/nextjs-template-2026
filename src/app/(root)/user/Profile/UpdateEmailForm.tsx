'use client'

import * as React from 'react'

import { authClient } from '@/lib/auth-client'
import { toast } from 'sonner'
// import { z } from 'zod'

import { Button, Input } from '@/components'
import { cn } from '@/utils'

type UpdateEmailFormProps = React.ComponentProps<'form'> & {
  currentEmail: string
}

// const updateEmailSchema = z.object({
//   newEmail: z.email({ message: 'Enter a valid email' })
// })

// type UpdateEmailValues = z.infer<typeof updateEmailSchema>

/* ========================================================================

======================================================================== */
// ✅ Coding in Flow at 1:47:30 : https://www.youtube.com/watch?v=w5Emwt3nuV0
// ✅ WDS at 2:02:45            : https://www.youtube.com/watch?v=WPiqNDapQrk
// https://better-auth.com/docs/concepts/users-accounts#change-email

//# Here we 100% need to have a confirm password field.
//# Otherwise, there's an increased risk that the user will inadvertently
//# update the email to the WRONG email and then get locked out.

export const UpdateEmailForm = ({ className = '', currentEmail = '', ...otherProps }: UpdateEmailFormProps) => {
  const [newEmail, setNewEmail] = React.useState(() => {
    if (currentEmail && typeof currentEmail === 'string') {
      return currentEmail
    }
    return ''
  })

  const [pending, setPending] = React.useState(false)

  /* ======================

  ====================== */

  const handleUpdateEmail = async (e: any) => {
    e.preventDefault()

    // We could do this, but what if we wanted to update the image, but not the email?
    // if (newEmail === currentEmail) {
    //   toast.error("You can't use the same email address.")
    //   return
    // }

    //# Validation!!!
    if (!newEmail) {
      return
    }

    setPending(true)

    try {
      //# Test what happens if one tries to update an email to an existing email.

      // This works against OAuth or credential signups. Changing email
      // for a user with an Oath account does not break the login flow.
      const { data, error } = await authClient.changeEmail({
        newEmail,
        callbackURL: '/user?email_updated=true'
      })

      if (error) {
        toast.error('Unable to send email verification.')
        return
      }

      if (data) {
        toast.success('Email verification sent.')
        return
      }
    } catch (_err) {
      toast.error('Unable to send email verification.')
    } finally {
      setPending(false)
    }
  }

  /* ======================
        useEffect()
  ====================== */
  ///////////////////////////////////////////////////////////////////////////
  //
  // Initially, this component accepted the user as a prop, then did this:
  //
  //   React.useEffect(() => {
  //     if (user && user.email && typeof user.email === 'string') {
  //       setNewEmail(user.email)
  //     }
  //   }, [user])
  //
  // The problem above is that when authClient.changeEmail() fires, the authClient.useSession()
  // will be refreshed, and at this point the user will be a new reference object, even if
  // nothing has changed among the object properties.
  //
  ///////////////////////////////////////////////////////////////////////////

  React.useEffect(() => {
    //! Don't fire on mount!
    if (currentEmail && typeof currentEmail === 'string') {
      setNewEmail(currentEmail)
    }
  }, [currentEmail])

  /* ======================
          return
  ====================== */

  return (
    <form
      {...otherProps}
      onSubmit={(e) => e.preventDefault()}
      className={cn('bg-card mx-auto mb-2 max-w-lg space-y-4 rounded-lg border p-4 shadow', className)}
      noValidate
    >
      <Input
        label='Email'
        labelRequired
        autoComplete='off'
        name='email'
        onChange={(e) => setNewEmail(e.target.value)}
        placeholder='Email...'
        spellCheck={false}
        type='text'
        value={newEmail}
      />

      <Button className='flex w-full' loading={pending} type='button' onClick={handleUpdateEmail}>
        {pending ? 'Saving...' : 'Save Changes'}
      </Button>
    </form>
  )
}
