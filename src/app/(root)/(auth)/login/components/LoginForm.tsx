'use client'
// import type { Route } from 'next'
import * as React from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { toast } from 'sonner'

import { authClient } from '@/lib/auth-client'
import { Button, Input } from '@/components'
import { login } from '@/actions'

const googleSVG = (
  <svg width='32px' height='32px' viewBox='0 0 16 16' fill='none'>
    <path
      fill='#4285F4'
      d='M14.9 8.161c0-.476-.039-.954-.121-1.422h-6.64v2.695h3.802a3.24 3.24 0 01-1.407 2.127v1.75h2.269c1.332-1.22 2.097-3.02 2.097-5.15z'
    />
    <path
      fill='#34A853'
      d='M8.14 15c1.898 0 3.499-.62 4.665-1.69l-2.268-1.749c-.631.427-1.446.669-2.395.669-1.836 0-3.393-1.232-3.952-2.888H1.85v1.803A7.044 7.044 0 008.14 15z'
    />
    <path fill='#FBBC04' d='M4.187 9.342a4.17 4.17 0 010-2.68V4.859H1.849a6.97 6.97 0 000 6.286l2.338-1.803z' />
    <path
      fill='#EA4335'
      d='M8.14 3.77a3.837 3.837 0 012.7 1.05l2.01-1.999a6.786 6.786 0 00-4.71-1.82 7.042 7.042 0 00-6.29 3.858L4.186 6.66c.556-1.658 2.116-2.89 3.952-2.89z'
    />
  </svg>
)

const githubSVG = (
  <svg width='32' height='32' fill='currentColor' viewBox='0 0 16 16'>
    <path d='M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8' />
  </svg>
)

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

  const handleOAuthLogin = async (provider: 'github' | 'google') => {
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
            {googleSVG}
          </button>

          <button
            className='cursor-pointer transition-transform hover:scale-125'
            onClick={() => {
              handleOAuthLogin('github')
            }}
            type='button'
          >
            {githubSVG}
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
