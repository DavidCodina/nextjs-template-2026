'use server'

import { headers } from 'next/headers'

import { APIError } from 'better-auth/api'
import { auth } from '@/lib/auth'
// import { prisma } from '@/lib/db/prisma'
import { codes } from '@/utils'
import { ResponsePromise } from '@/types'

type RequestData = {
  password: string
  confirmPassword: string
}

//! type Data = null
type Data = any
export type LinkCredentialsResponsePromise = ResponsePromise<Data>
export type LinkCredentials = (requestData: RequestData) => LinkCredentialsResponsePromise
export type LinkCredentialsResolvedResponse = Awaited<LinkCredentialsResponsePromise>

//# 2026  Switch to Zod validation...

/* ========================================================================

======================================================================== */

export const linkCredentials: LinkCredentials = async ({ password, confirmPassword }) => {
  try {
    // await sleep(1500)
    /* ======================
          Validation
    ====================== */

    const formErrors: Record<string, string> = {}

    if (typeof password !== 'string' || password.trim().length < 5) {
      formErrors.password = 'A password must be at least 5 characters. (Server)'
    }

    if (!confirmPassword || typeof confirmPassword !== 'string') {
      formErrors.confirmPassword = 'The confirm password field is required. (Server)'
    } else if (password !== confirmPassword) {
      formErrors.confirmPassword = 'The passwords must match. (Server)'
    }

    if (Object.keys(formErrors).length > 0) {
      return {
        code: 'BAD_REQUEST',
        data: null,
        errors: formErrors,
        message: 'The form data is invalid.',
        success: false
      }
    }

    /* ======================

    ====================== */

    const _result = await auth.api.setPassword({
      body: {
        newPassword: password
      },
      headers: await headers()
    })

    /* ======================
            Response
    ====================== */

    return {
      code: codes.UPDATED,
      data: null,
      errors: null,
      message: 'The password has been updated.',
      success: true
    }
  } catch (err) {
    if (err instanceof APIError) {
      // ...
    }

    if (err instanceof Error) {
      //^ Better Auth enforces longer passwords by default, so use: 12345678
      // Example: { name: 'APIError', message: 'Password too short' }
      // console.log({ name: err.name, message: err.message })
    }
    return {
      code: codes.INTERNAL_SERVER_ERROR,
      data: null,
      message: 'Server error.',
      success: false
    }
  }
}
