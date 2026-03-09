import { betterAuth } from 'better-auth'
import { APIError, createAuthMiddleware } from 'better-auth/api'

import { prismaAdapter } from 'better-auth/adapters/prisma'
import { prisma } from '@/lib/db/prisma'

///////////////////////////////////////////////////////////////////////////
//
// https://www.better-auth.com/docs/integrations/next#server-action-cookies
// When you call a function that needs to set cookies, like signInEmail or
// signUpEmail in a server action, cookies won’t be set. This is because
// server actions need to use the cookies helper from Next.js to set cookies.
//
// To simplify this, you can use the nextCookies plugin, which will automatically
// set cookies for you whenever a Set-Cookie header is present in the response.
//# In theory, this should help sync the client/browser with the server.
//# I need to test this.
//
///////////////////////////////////////////////////////////////////////////
import { nextCookies } from 'better-auth/next-js'
import { sendVerificationEmail } from './sendVerificationEmail'
import { sendResetPasswordEmail } from './sendResetPasswordEmail'

// type StatusCode = ConstructorParameters<typeof APIError>[0]

/* ========================================================================

======================================================================== */

// https://www.better-auth.com/docs/adapters/prisma
// https://www.better-auth.com/docs/concepts/cli

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'postgresql'
  }),

  // WDS touches on rate limiting at 35:20. This is disabled in development, and enabled in production.
  // However, Next.js is serverless and the rate limiting logic is normally stored in memory, so
  // it woulnd't work in serverless environments. The solution is to change the rateLimit.storage to
  // be "database". But that actual solution proposed by WDS is to use Arcjet.
  // rateLimit: {},

  // https://www.better-auth.com/docs/reference/options#user
  //# Configure for firstName, lastName
  user: {
    // https://better-auth.com/docs/concepts/users-accounts#delete-user
    deleteUser: {
      enabled: true

      //# https://better-auth.com/docs/concepts/users-accounts#adding-verification-before-deletion
      //# For added security, you’ll likely want to confirm the user’s intent before deleting their account.
      // sendDeleteAccountVerification:
    },

    // https://better-auth.com/docs/concepts/users-accounts#change-email
    // WDS at 2:02:30
    // Coding In Flow at 1:49:30
    changeEmail: {
      enabled: true

      ///////////////////////////////////////////////////////////////////////////
      //
      // https://better-auth.com/docs/concepts/users-accounts#change-email
      // Coding in Flow at 1:47:30 : https://www.youtube.com/watch?v=w5Emwt3nuV0
      // WDS at 2:02:45            : https://www.youtube.com/watch?v=WPiqNDapQrk
      //
      // By default, when a user requests to change their email, a verification email is sent to
      // the new email address.
      //
      //    const { data, error } = await authClient.changeEmail({ newEmail, callbackURL: '/' })
      //
      // The email is only updated after the user verifies the new email. This occurs when
      // through the emailVerification implementation already set up in the registration flow.
      //
      // https://better-auth.com/docs/concepts/users-accounts#confirming-with-current-email
      // Confirming with Current Email: For added security, you can require users to confirm the
      // change via their current email before the verification email is sent to the new address.
      // To do this, provide the sendChangeEmailConfirmation function. In Coding In Flow tutorial
      // at 1:50:20, he says he doesn't really know what the best approach is. Currently, I'm
      // using the less secure approach where the email verification goes to the NEW email. The
      // problem with the more secure approach of sending it to the old email
      // (i.e. sendChangeEmailConfirmation) is that in many cases, a user may be trying to change
      // their email on this app because they no longer have access to their old email account.
      //
      ///////////////////////////////////////////////////////////////////////////

      // sendChangeEmailConfirmation: async (parameter, _request) => {
      //   const { user, newEmail, url /* , token */ } = parameter
      //   // https://better-auth.com/docs/concepts/users-accounts#change-email
      //   // ⚠️ Avoid awaiting the email sending to prevent timing attacks.
      //   // On serverless platforms, use waitUntil or similar to ensure the email is sent.
      //
      //   // Send the email to the new email address...
      // }
    },

    additionalFields: {
      ///////////////////////////////////////////////////////////////////////////
      //
      // Note: BETTER-AUTH also provides plugins for more sophisticated access control.
      // See here for more info:
      //
      //   - better-auth.com/docs/plugins/admin
      //   - better-auth.com/docs/plugins/organization
      //
      ///////////////////////////////////////////////////////////////////////////
      role: {
        type: 'string',
        input: false
      }
    }
  },

  // https://www.better-auth.com/docs/concepts/session-management#session-caching
  // https://www.better-auth.com/docs/reference/options#session
  // WDS at 14:15 ( https://www.youtube.com/watch?v=WPiqNDapQrk ) demonstrates
  // how to cache a session. This is something worth exploring.
  // If a session is revoked or expires, the cookie will be invalidated

  session: {
    // cookieCache: {
    //   enabled: true,
    //   maxAge: 2 * 60 // 1 minute
    //   // This should proactively refresh the cache, but it's not working
    //   // https://better-auth.com/docs/concepts/session-management#understanding-refreshcache
    //   // https://github.com/better-auth/better-auth/issues/6009
    //   // https://github.com/better-auth/better-auth/issues/7607
    //   // refreshCache: true
    //   // Also not working...
    //   //^ WARN [Better Auth]: [better-auth] `session.cookieCache.refreshCache` is enabled while `database` or `secondaryStorage` is configured. `refreshCache` is meant for stateless (DB-less) setups. Disabling `refreshCache` — remove it from your config to silence this warning.
    //   // refreshCache: {
    //   //   updateAge: 30 // Refresh when 30 seconds remain before expiry
    //   // }
    // }
  },

  // Note: account linking is enabled by default in Better Auth, and OAuth providers like Google and GitHub are trusted by default.
  // Thus, explicitly enabling it and setting trustedProviders: ['google', 'github'] isn't doing anything new.

  account: {
    accountLinking: {
      // enabled: true, // Default is true

      // If you want your users to be able to link a social account with a different email
      // address than the user, or if you want to use a provider that does not return email addresses,
      // you will need to enable this in the account linking settings.
      allowDifferentEmails: true

      // If you want the newly linked accounts to update the user information,
      // you need to enable this in the account linking settings.
      // updateUserInfoOnLink: true

      ///////////////////////////////////////////////////////////////////////////
      //
      // According to AI: trustedProviders only applies in one direction: it allows trusted
      // OAuth providers (Google, GitHub) to automatically link to an existing credentials
      // account when the emails match. It does not handle the reverse — a credentials sign-up
      // linking to an existing OAuth-only account.
      //
      // The key insight is that trustedProviders is asymmetric by design — social providers are trusted
      // to claim an existing email, but a credentials sign-up is not trusted to claim an existing social
      // account, since it could be used to hijack an account by someone who merely knows the email address.
      //
      ///////////////////////////////////////////////////////////////////////////
      // trustedProviders: ['google', 'github']
    }
  },

  // trustedOrigins: ...

  // https://www.better-auth.com/docs/authentication/email-password
  // https://www.better-auth.com/docs/reference/options#emailandpassword
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
    maxPasswordLength: 128,
    minPasswordLength: 5,

    // If you try to log in with an unverified email, you'll get an "Email not verified" error.
    // {message: 'Email not verified', code: 'EMAIL_NOT_VERIFIED', status: 403, statusText: 'FORBIDDEN'}
    requireEmailVerification: true,
    sendResetPassword: async (parameter, _request) => {
      const { user, url /*, token */ } = parameter
      await sendResetPasswordEmail({
        email: user.email,
        name: user.name,
        url
      })
    }
  },

  emailVerification: {
    //  autoSignInAfterVerification: true,

    ///////////////////////////////////////////////////////////////////////////
    //
    // By default, this is undefined. However, the feature seems to work fine without it.
    // The `requireEmailVerification: true` is already triggering it. According to AI (???),
    //
    //   sendOnSignUp targets OAuth provider signups, not credential signups. When a user registers
    //   via Google, GitHub, etc., Better Auth won't send a verification email by default — because
    //   the assumption is the OAuth provider already vouched for the email. Setting sendOnSignUp: true
    //   overrides this and fires your sendVerificationEmail handler for those OAuth users too.
    //
    // For now, I'm content with no email verification for OAuth signups.
    //
    ///////////////////////////////////////////////////////////////////////////

    // ❌ sendOnSignUp: true,
    sendVerificationEmail: async (parameter, _request) => {
      const { user, url, token: _token } = parameter

      // https://better-auth.com/docs/authentication/email-password#email-verification
      // ⚠️ Avoid awaiting the email sending to prevent timing attacks.
      // On serverless platforms, use waitUntil or similar to ensure the email is sent.
      sendVerificationEmail({
        email: user.email,
        name: user.name,
        url
      })
    }
  },

  // https://www.better-auth.com/docs/concepts/oauth
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string
    },

    // https://better-auth.com/docs/authentication/github
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string
      // WDS at 1:53:30
      // mapProfileToUser: (_profile) => { return {} }
    },
    // https://better-auth.com/docs/authentication/linkedin
    // https://www.linkedin.com/developers/apps
    linkedin: {
      clientId: process.env.LINKEDIN_CLIENT_ID as string,
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET as string
    }
  },

  plugins: [
    // stripe({ ... })

    // ⚠️ nextCookies() must be the LAST plugin in the list.
    nextCookies()
  ],

  /////////////////////////////////////////////////////////////////////////////
  //
  // https://better-auth.com/docs/concepts/hooks
  // The before hook can be used for blacklisting, server-side validation, etc.

  // ✅ Coding In Flow at 1:19:00 : https://www.youtube.com/watch?v=w5Emwt3nuV0
  //
  // ✅  WDS at 1:41:00           : https://www.youtube.com/watch?v=WPiqNDapQrk
  //     He uses `after` to send a welcom email after the user signs up.
  //
  // ✅ TomDoesTech at 8:15      : https://www.youtube.com/watch?v=RKqHrE0KyeE
  //    He also gives a welcome email example.
  //
  // - Syntax at 11:40, 13:15 uses a hook for part of password reset.
  // - Syntax at 15:40,
  //
  ///////////////////////////////////////////////////////////////////////////
  hooks: {
    ///////////////////////////////////////////////////////////////////////////
    //
    // Path for email registration: '/sign-up/email',
    // Path for email login Path:   '/sign-in/email'
    // Path for sign out:           '/sign-out'
    // Path social sign in:         '/sign-in/social'
    // Check body.provider for 'google', 'github', etc.
    //
    ///////////////////////////////////////////////////////////////////////////
    before: createAuthMiddleware(
      // https://better-auth.com/docs/concepts/hooks#ctx
      async (ctx) => {
        // console.log({
        //   path: ctx.path,
        //   body: ctx.body,
        //   session: ctx.context.session,
        //   newSession: ctx.context.newSession
        //   // context: ctx.context
        // })

        ///////////////////////////////////////////////////////////////////////////
        //
        // Returning nothing (or just return) → the hook is observation-only, and the request continues as normal.
        // If you want to modify the return, then return { context: { ... } } as follows:
        //
        // if (ctx.path === '/sign-up/email') {
        //   return {
        //     context: {
        //       ...ctx,
        //       body: {
        //         ...ctx.body,
        //         name: 'John Doe'
        //       }
        //     }
        //   }
        // }
        //
        ///////////////////////////////////////////////////////////////////////////

        if (ctx.path === '/sign-up/email') {
          if (ctx.body.email === 'blacklisted@example.com') {
            ///////////////////////////////////////////////////////////////////////////
            //
            // https://better-auth.com/docs/concepts/hooks#json-responses
            // Using ctx.json() doesn't quite work how you may expext.
            //
            //   return ctx.json(
            //     { code: 'BLACKLISTED_EMAIL', data: null,  message: 'This email is blacklisted.', success: false }
            //   )
            //
            // If you use this on client:
            //
            //  const { data, error } = await authClient.signUp.email( ... )
            //
            // Then the return object will be a serialized string on the data property.
            // Conversely, when you use this on the server:
            //
            //    const result = await auth.api.signUpEmail( ... )
            //
            // The result will be the expected object - instead of { token, user }
            // While this approach works well enough for simple use cases, it still
            // doesn't allow you to send back more complex objects without things
            // getting a little hacky. Thus, it's not greate for itemized form errors, etc.
            // However, in most cases, we don't want that anyways.
            //
            ///////////////////////////////////////////////////////////////////////////

            throw new APIError('BAD_REQUEST', {
              code: 'EMAIL_BLACKLISTED',
              message: 'This email is blacklisted.'
            })
          }
        }
      }
    )
  }
})
