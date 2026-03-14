'use client'

import * as React from 'react'

import { authClient } from '@/lib/auth-client'
import { toast } from 'sonner'
// import { z } from 'zod'

import { Button, Input } from '@/components'
import { cn } from '@/utils'

// const updateProfileSchema = z.object({
//   name: z.string().trim().min(1, { message: 'Name is required' }),
//   image: z.string().optional().nullable() // Better to make this a string URL.
// })

// type UpdateProfileValues = z.infer<typeof updateProfileSchema>

type UpdateUserFormProps = React.ComponentProps<'form'> & {
  currentName: string
}

/* ========================================================================

======================================================================== */
// Coding in Flow at 1:42:30 : https://www.youtube.com/watch?v=w5Emwt3nuV0
// https://github.com/codinginflow/better-auth-tutorial/blob/final-project/src/app/(main)/profile/profile-details-form.tsx

export const UpdateUserForm = ({ className = '', currentName = '', ...otherProps }: UpdateUserFormProps) => {
  const [name, setName] = React.useState(() => {
    if (currentName && typeof currentName === 'string') {
      return currentName
    }
    return ''
  })

  const [pending, setPending] = React.useState(false)

  /* ======================

  ====================== */

  const handleUpdateUser = async (e: any) => {
    e.preventDefault()
    setPending(true)

    //# Validation!!!

    try {
      ///////////////////////////////////////////////////////////////////////////
      //
      // ⚠️ What we can actually update here seems pretty limited. In theory, we can
      // also update custom fields in the user record here.
      //
      // https://better-auth.com/docs/concepts/users-accounts#update-user-information
      // To update user information, you can use the updateUser function provided by the client.
      // The updateUser function takes an object with the following properties: { name, image }
      //
      // See Coding In Flow at 1:44:30 for image implementation. He implements an image preview.
      // However, all we really need is a string URL. Currently, I haven't focused much on image s.
      //
      ///////////////////////////////////////////////////////////////////////////
      const { data, error } = await authClient.updateUser({
        name: name
        //# image
      })

      if (error) {
        toast.error('Unable to update user.')
        return
      }

      if (data) {
        // data will merely be { status: true }
        toast.success('User updated.')

        ///////////////////////////////////////////////////////////////////////////
        //
        // No need to call router.refresh() here since we're using authClient.useSession()
        // and not getServerSession(). Note: calling authClient.updateUser() seems to trigger
        // a refresh of the authClient.useSession() component that invokes it.
        //
        // If the user was originally derived from a server session, then it might make sense
        // to call router.refresh() here. That said, router.refresh() would retrigger all
        // API calls in page.tsx and nested server components. As such, it's not very precise,
        // and could lead to poor UX.
        //
        // The current implementation originally just left the state as is. However, a better
        // approach implements a useEffect() to watch for changes to user.
        //
        ///////////////////////////////////////////////////////////////////////////
        // ❌ router.refresh()
        return
      }
    } catch (_err) {
      toast.error('Unable to update user.')
    } finally {
      setPending(false)
    }
  }

  /* ======================
        useEffect()
  ====================== */

  React.useEffect(() => {
    //! Don't fire on mount!
    if (currentName && typeof currentName === 'string') {
      setName(currentName)
    }
  }, [currentName])

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
        label='Full Name'
        labelRequired
        autoComplete='off'
        name='fullName'
        onChange={(e) => setName(e.target.value)}
        placeholder='Full Name...'
        spellCheck={false}
        type='text'
        value={name}
      />

      {/* 
      //# Add image logic here...
       */}

      <Button className='flex w-full' loading={pending} type='button' onClick={handleUpdateUser}>
        {pending ? 'Saving...' : 'Save Changes'}
      </Button>
    </form>
  )
}
