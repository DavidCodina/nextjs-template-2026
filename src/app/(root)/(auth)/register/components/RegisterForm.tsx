'use client'

import React, { Fragment, useState, useTransition } from 'react'
// import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { toast } from 'sonner'
import { Button, Input } from '@/components'
//# import { authClient } from '@/lib/auth-client'

// Here we're using a server action, which works in this specific case because
// we're not logging the user in automatically. However, if we were doing that
// then the UI would likely not update on the client. For this reason, it's
//#  best to instead use: authClient.signUp()
//# The Basic Usage docs provide an example with onRequest, onSuccess, onError.
import { register } from '@/actions'

// import * as z from "zod";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";

/* ========================================================================

======================================================================== */

export const RegisterForm = () => {
  // const router = useRouter()
  //! const [firstName, setFirstName] = useState('')
  //! const [lastName, setLastName] = useState('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [registrationPending, startRegistrationTransition] = useTransition()

  /* ======================

  ====================== */

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault()

    //   if (
    //     !firstName ||
    //     typeof firstName !== 'string' ||
    //     !lastName ||
    //     typeof lastName !== 'string' ||
    //     !email ||
    //     typeof email !== 'string' ||
    //     !password ||
    //     typeof password !== 'string' ||
    //     !confirmPassword ||
    //     typeof confirmPassword !== 'string'
    //   ) {
    //     toast.error('All fields are required.')
    //     return
    //   }

    startRegistrationTransition(async () => {
      try {
        //# Switch to client-side signUp.
        //# WDS does this at 28:00
        //# However, the thing I don't like about this is that there's
        //# no way to do additional server-side validation.
        //# Check online/AI to see if there's additional configuration options.
        //# Otherwise, it may actually be better to stick with the server action.

        // const { data, error } = await authClient.signUp.email({
        //   name: fullName,
        //   email,
        //   password,
        //   // Coding In Flow at 19:40
        //   // On the other hand, the callbackURL is important for email verification.
        //   callbackURL: '/email-verified'
        // })

        const res = await register({
          name,
          email,
          password,
          confirmPassword
        })

        ///////////////////////////////////////////////////////////////////////////
        //
        // If you wanted to automatically sign the user in after registering
        // you can import { signIn } from 'next-auth/react' then do this:
        //
        //   signIn('credentials', { email, password, callbackUrl: '/user' })
        //
        // However, it's probably better to not do this and instead create
        // an additional step whereby the user must verify their email prior
        // to logging in for the first time.
        //
        ///////////////////////////////////////////////////////////////////////////

        if (res.success === true) {
          // toast.success('Registration success! Confirmation email sent.')
          toast.success('Reigistration success!')
          // Because we're using requireEmailVerification: true, we can instead
          // use the callbackURL in the Better Auth signUp function. It won't redirect
          // until AFTER the email is verified. Actually, the redirect will open in a
          // new tab, rather than from the current application tab.

          // ❌ router.push('/login')
        } else {
          toast.error('Unable to register.')
        }
      } catch {
        toast.error('Unable to register.', {
          duration: Infinity
        })
      } finally {
        setName('')
        setEmail('')
        setPassword('')
        setConfirmPassword('')
      }
    })
  }

  /* ======================
          return
  ====================== */

  return (
    <Fragment>
      <form
        onSubmit={(e) => e.preventDefault()}
        className='bg-card mx-auto mb-2 max-w-lg space-y-4 rounded-lg border p-4 shadow'
        noValidate
      >
        {/* <Input
          label='First Name'
          labelRequired
          autoComplete='off'
          name='firstName'
          onChange={(e) => setFirstName(e.target.value)}
          placeholder='First Name...'
          spellCheck={false}
          type='text'
          value={firstName}
        />

        <Input
          label='Last Name'
          labelRequired
          autoComplete='off'
          name='lastName'
          onChange={(e) => setLastName(e.target.value)}
          placeholder='Last Name...'
          spellCheck={false}
          type='text'
          value={lastName}
        /> */}

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

        <Input
          label='Password'
          labelRequired
          autoComplete='off'
          name='password'
          onChange={(e) => setPassword(e.target.value)}
          placeholder='Password...'
          spellCheck={false}
          type='password'
          value={password}
        />

        <Input
          label='Confirm Password'
          labelRequired
          autoComplete='off'
          name='confirmPassword'
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder='Confirm Password...'
          spellCheck={false}
          type='password'
          value={confirmPassword}
        />

        <Button className='flex w-full' loading={registrationPending} type='button' onClick={handleSubmit}>
          Register
        </Button>
      </form>

      {/* 
        //# What is target='_self' ?
      */}

      <div className='text-muted-foreground text-center text-sm'>
        Already have an account?{' '}
        <Link className='text-primary font-medium underline' href='/login' target='_self'>
          Sign In
        </Link>
      </div>
    </Fragment>
  )
}
