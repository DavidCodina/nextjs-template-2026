import { betterAuth } from 'better-auth'
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
    // WDS at 2:02:30
    // changeEmail: {
    //   enabled: true,
    //   // sendChangeEmailVerification: async ({ user, url, newEmail }) => { }
    // },
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
    cookieCache: {
      enabled: true,
      maxAge: 2 * 60 // 1 minute
      // This should proactively refresh the cache, but it's not working
      // https://better-auth.com/docs/concepts/session-management#understanding-refreshcache
      // https://github.com/better-auth/better-auth/issues/6009
      // https://github.com/better-auth/better-auth/issues/7607
      // refreshCache: true
      // Also not working...

      //^ WARN [Better Auth]: [better-auth] `session.cookieCache.refreshCache` is enabled while `database` or `secondaryStorage` is configured. `refreshCache` is meant for stateless (DB-less) setups. Disabling `refreshCache` — remove it from your config to silence this warning.
      // refreshCache: {
      //   updateAge: 30 // Refresh when 30 seconds remain before expiry
      // }
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

      // Should we wrap in try/catch? It wouldn't matter since sendVerificationEmail()
      // itself is wrapped in try/catch. But what happens if it fails? How do we retry?
      await sendVerificationEmail({
        email: user.email,
        name: user.name,
        url
      })
    }
  },

  // https://www.better-auth.com/docs/concepts/oauth
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!
    },

    // https://better-auth.com/docs/authentication/github
    github: {
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!

      // WDS at 1:53:30
      // mapProfileToUser: (_profile) => { return {} }
    }
  },

  plugins: [
    // stripe({ ... })

    // ⚠️ nextCookies() must be the LAST plugin in the list.
    nextCookies()
  ],

  // Todo: Review the TomDoesTech video at 8:15.
  //# He shows a hook that seems to work with Resend.
  //# See also WDS at 1:41:00
  hooks: {}
})
