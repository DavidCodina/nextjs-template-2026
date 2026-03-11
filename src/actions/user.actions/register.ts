'use server'

import { APIError } from 'better-auth/api'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db/prisma'
import { codes } from '@/utils'
import { /* Code, */ ResponsePromise } from '@/types'

type RequestData = {
  // firstName: string
  // lastName: string
  name: string
  email: string
  password: string
  confirmPassword: string
}

//! type Data = null
type Data = any
export type RegisterResponsePromise = ResponsePromise<Data>
export type Register = (requestData: RequestData) => RegisterResponsePromise
export type RegisterResolvedResponse = Awaited<RegisterResponsePromise>

//# 2026  Switch to Zod validation...

/* ========================================================================

======================================================================== */
// Why is this in user.actions folder? Register is arguably NOT part of auth.
// Rather, what we're doing is creating a user, so conceptually it's part
// of user.actions.

export const register: Register = async ({ name, email, password, confirmPassword }) => {
  try {
    // await sleep(1500)
    /* ======================
          Validation
    ====================== */

    const formErrors: Record<string, string> = {}

    if (!name || (typeof name === 'string' && name.trim() === '')) {
      formErrors.firstName = 'A full name is required. (Server)'
    }

    // if (!firstName || (typeof firstName === 'string' && firstName.trim() === '')) {
    //   formErrors.firstName = 'A first name is required. (Server)'
    // }

    // if (!lastName || (typeof lastName === 'string' && lastName.trim() === '')) {
    //   formErrors.lastName = 'A last name is required. (Server)'
    // }

    const regex =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/

    if (!email || (typeof email === 'string' && email.trim() === '')) {
      formErrors.email = 'An email is required. (Server)'
    } else if (!regex.test(email)) {
      formErrors.email = 'A valid email is required. (Server)'
    } else {
      ///////////////////////////////////////////////////////////////////////////
      //
      // ⚠️ Case Sensitivity: https://www.prisma.io/docs/orm/prisma-client/queries/case-sensitivity
      //
      // Note: if email is 'DAVID@example.com' but 'david@example.com' alread exists, Prisma will
      // throw a PrismaClientKnownRequestError because the uniqueness constraint will have failed.
      // In other words, uniqueness is not case insensitive. Similarly, when querying for a user by
      // email it will also be case insensitive by default.
      //
      // Apparently, Prisma queries are case-insensitive by default.
      // While Prisma's query language itself is case-sensitive by default, the underlying database
      // and its configuration can sometimes lead to case-insensitive behavior for certain operations.
      // Thus if you did this in MySQL workbench:
      //
      //   SELECT * from users WHERE email = "DAVID@example.com";
      //
      // You would likely get back the record with email 'david@example.com'.
      // In the case of MySQL, the case sensitivity of string comparisons is determined by the collation
      // of the column. Collation is a set of rules that define how character data is sorted and compared.
      //
      // While we can rely on that default behavior, it's still a good practice to explicitly specify
      // case-insensitivity at the level of Prisma. That said, findUnique() doesn't support the `mode`
      // option, so you'll need to use findFirst() instead.
      //
      //  const existingUser = await prisma.user.findUnique({ where: { email }  })
      //
      ///////////////////////////////////////////////////////////////////////////
      const existingUser = await prisma.user.findFirst({
        where: {
          email: {
            equals: email,
            mode: 'insensitive'
          }
        }
      })
      if (existingUser) {
        // ❌ formErrors.email = 'A user with that email already exists. (Server)' // 409 Conflict error
        formErrors.email = 'Invalid email.'
      }
    }

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
          Create User
    ====================== */

    ///////////////////////////////////////////////////////////////////////////
    //
    // The result will be an object that looks like this:
    //
    //   {
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

    const result = await auth.api.signUpEmail({
      body: {
        email,
        // On the server side, Better Auth automatically hashes the password before
        // storing it in the database. You never see or handle the raw password after this point.
        password: password,
        name: name,
        // When using requireEmailVerification: true, it makes more sense to use callbackURL.
        // This will be where the user is redirected to. After they verify their email, a new
        // browser tab will open the application. On the other hand, if you're not using
        // email verification, it's preferable to programmatically navigate to the login page
        // on success.
        callbackURL: '/login?verified=true'
        // callbackURL: '/login'
        // image?: string | undefined;
        // rememberMe?: boolean | undefined;
      }
    })

    /* ======================
           Response
    ====================== */

    return {
      code: codes.CREATED,
      data: result, //! DC 2026 : This was null. I added it for now...
      errors: null,
      message: 'Registration success.', //# message: 'Confirmation email sent.',
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
      code: 'INTERNAL_SERVER_ERROR',
      data: null,
      message: 'Server error.',
      success: false
    }
  }
}
