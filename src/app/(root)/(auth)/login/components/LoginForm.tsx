'use client'
// import type { Route } from 'next'
import * as React from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { toast } from 'sonner'

import { authClient } from '@/lib/auth-client'
import { GitHub } from './GitHub'
import { Google } from './Google'
import { LinkedIn } from './LinkedIn'

import { Button, Input } from '@/components'
import { login } from '@/actions'

/* ========================================================================

======================================================================== */

const LoginForm = () => {
  const router = useRouter()
  // ⚠️ When implementing useSearchParams(), it's generally recommended to wrap in Suspense.
  const searchParams = useSearchParams()

  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [emailLoginPending, startEmailLoginTransition] = React.useTransition()

  /* ======================

  ====================== */

  React.useEffect(() => {
    const verified = searchParams.get('verified')

    if (verified === 'true') {
      toast.success('Email verification successful!')
    }
  }, []) // eslint-disable-line

  /* ======================

  ====================== */

  const _handleServerEmailLogin = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault()

    if (!email || typeof email !== 'string' || !password || typeof password !== 'string') {
      toast.error('Email and password are required.')
      return
    }

    startEmailLoginTransition(async () => {
      try {
        const { data, message, success } = await login({
          email,
          password
        })

        if (success !== true) {
          const errorMessage = typeof message === 'string' ? message : 'Unable to log in.'
          toast.error(errorMessage, {
            // duration: Infinity
          })

          console.log('\nError from login() server action')
          console.log(message)
          return
        }

        toast.success('Login success.')
        console.log('\ndata from login() server action')
        console.log(data)

        router.replace('/user')
      } catch (err) {
        console.log('\nError from login() server action')
        console.log(err)
        toast.error('Unable to log in.')
      } finally {
        setEmail('')
        setPassword('')
      }
    })
  }

  /* ======================
  resendVerificationEmail()
  ====================== */
  // This works for now, but a better implementation would be to have a button that
  // opens a modal or redirects to a separate page. Then there would be a form where the user
  // can enter their email. As of right now, the user has no idea how to proactively request
  // a verification email until they've already attempted to log in.

  const resendVerificationEmail = async (email: string) => {
    try {
      const _result = await authClient.sendVerificationEmail({
        ///////////////////////////////////////////////////////////////////////////
        //
        // email is used by Better Auth to look up the user in the database by email.
        // Then it generates a verification token for that user, then calls the sendVerificationEmail helper.
        // For development, we can set the email to 'delivered@resend.dev'. However, that will still only work
        // if the actual user's email is 'delivered@resend.dev'. Otherwise, Better Auth won't find a matching
        // user and will silently do nothing.
        //
        // So... What we actually need to do is derive the email from the form login attempt.
        // Regardless of what email is, the sendVerificationEmail() currently has
        // 'delivered@resend.dev' hardcoded. That said, the actual email is still important
        // for Better Auth's internal logic to look up the user in the database - even during development.
        //
        ///////////////////////////////////////////////////////////////////////////
        email: email,
        callbackURL: '/login?verified=true'
      })

      // if (result.data) { console.log('\nResend verification email success.', _result.data)  }
      // if (result.error) { console.log('\nError resending verification email.', _result.error) }
    } catch (_err) {
      // ...
    }
  }

  /* ======================
    handleClientEmailLogin()
  ====================== */

  const handleClientEmailLogin = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault()

    if (!email || typeof email !== 'string' || !password || typeof password !== 'string') {
      toast.error('Email and password are required.')
      return
    }

    startEmailLoginTransition(async () => {
      try {
        // https://www.better-auth.com/docs/basic-usage#sign-in
        const { /* data,*/ error } = await authClient.signIn.email(
          {
            email,
            password
            // callbackURL: '/user'

            //# This is an interesting feature.
            //# rememberMe determines if the user remains logged in after they close the website
            //# Test it out, and decide whether you want it to be true | false.
            //# Also test cross-tab compatibility.

            // rememberMe: false
          },
          {
            // callbacks // ???
          }
        )

        // data and error are a discriminated union.
        if (error) {
          ///////////////////////////////////////////////////////////////////////////
          //
          // The error will have the following shape:
          //
          //   {
          //     code?: string | undefined | undefined;
          //     message?: string | undefined | undefined;
          //     status: number;
          //     statusText: string;
          //   }
          //
          ///////////////////////////////////////////////////////////////////////////
          const errorMessage = typeof error.message === 'string' ? error.message : 'Unable to log in.'

          // {message: 'Email not verified', code: 'EMAIL_NOT_VERIFIED', status: 403, statusText: 'FORBIDDEN'}
          if (error.code === 'EMAIL_NOT_VERIFIED') {
            resendVerificationEmail(email)
            toast.error('Email not verified. Please check your email for a verification link.', {
              // duration: Infinity
            })
          } else {
            toast.error(errorMessage, {
              // duration: Infinity
            })
          }

          return
        }

        // Otherwise... (i.e., if data)

        ///////////////////////////////////////////////////////////////////////////
        //
        // The data will be an object that looks like this:
        //
        //   {
        //     redirect: false,
        //     token: '3OWZv...',
        //     user: {
        //       createdAt: 'Thu Dec 18 2025 16:31:53 GMT-0700 (Mountain Standard Time)',
        //       email: 'david@example.com',
        //       emailVerified: false,
        //       id: 'abc123',
        //       image: null,
        //       name: 'David Codina',
        //       updatedAt: 'Thu Dec 18 2025 16:31:53 GMT-0700 (Mountain Standard Time)'
        //     }
        //   }
        //
        ///////////////////////////////////////////////////////////////////////////

        toast.success('Login success.')

        // console.log('\ndata from authClient.signIn.email():')
        // console.log(data)

        //# Currently there is no redirect. This used to happen by default
        //# By virtue of the proxy.ts, but that may not be the best practice.
        //^ 2026 actually, double-check what happens when logging in when this is commented out.
        router.replace('/user')
      } catch (_err) {
        // console.log('\nError from authClient.signIn.email()')
        // console.log(err)
        toast.error('Unable to log in.')
      } finally {
        setEmail('')
        setPassword('')
      }
    })
  }
  /* ======================
      handleOAuthLogin()
  ====================== */

  const handleOAuthLogin = async (provider: 'github' | 'google' | 'linkedin') => {
    try {
      const _data = await authClient.signIn.social({
        provider: provider,
        callbackURL: '/user'
      })
    } catch (_err) {
      // ...
    }
  }

  /* ======================
          return
  ====================== */

  return (
    <>
      <form
        // ⚠️ Do not do this if using action={} here or formAction on Button.
        onSubmit={(e) => e.preventDefault()}
        // action={credentialsLoginAction}
        className='bg-card mx-auto mb-2 max-w-lg overflow-hidden rounded-lg border shadow'
        noValidate
      >
        <div
          className='flex justify-center gap-6 bg-white px-4 py-2'
          style={{ boxShadow: '0px 1px 3px rgba(0,0,0,0.25)' }}
        >
          <button
            className='cursor-pointer transition-transform hover:scale-125'
            onClick={() => {
              handleOAuthLogin('google')
            }}
            type='button'
          >
            <Google className='size-6' />
          </button>

          <button
            className='cursor-pointer transition-transform hover:scale-125'
            onClick={() => {
              handleOAuthLogin('github')
            }}
            type='button'
          >
            <GitHub className='size-6' />
          </button>

          <button
            className='cursor-pointer transition-transform hover:scale-125'
            onClick={() => {
              handleOAuthLogin('linkedin')
            }}
            type='button'
          >
            <LinkedIn className='size-6' />
          </button>
        </div>

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

          <Button
            className='flex w-full'
            loading={emailLoginPending}
            // ⚠️ Explicitly set to type='submit' if using 'formAction` or `action` props.
            // formAction={credentialsLoginAction}
            onClick={handleClientEmailLogin}
          >
            Login
          </Button>
        </div>
      </form>

      <div className='text-muted-foreground text-center text-sm'>
        {/* 
        //# What is target='_self' ?
        //# Why is the default behavior of Next.js to avoid ' ?
        */}
        Don&apos;t have an account?{' '}
        <Link className='text-primary font-medium underline' href='/register' target='_self'>
          Sign Up
        </Link>
      </div>

      <div className='text-muted-foreground text-center text-sm'>
        <Link className='text-primary font-medium underline' href='/forgot-password' target='_self'>
          Forgot Password?
        </Link>
      </div>
    </>
  )
}

const LoginFormWithSuspense = () => {
  return (
    <React.Suspense>
      <LoginForm />
    </React.Suspense>
  )
}

export { LoginFormWithSuspense as LoginForm }
