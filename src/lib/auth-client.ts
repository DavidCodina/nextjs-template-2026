import { createAuthClient } from 'better-auth/react' // make sure to import from better-auth/react
import { nextCookies } from 'better-auth/next-js'
import { auth } from './auth'
import { inferAdditionalFields } from 'better-auth/client/plugins'
// import { stripeClient } from '@better-auth/stripe/client'

/* ========================================================================

======================================================================== */
///////////////////////////////////////////////////////////////////////////
//
// https://www.better-auth.com/docs/integrations/next#create-a-client
// Once you have created the client, you can use it to sign up, sign in, and
// perform other actions. Some of the actions are reactive. The client uses
// nano-store to store the state and re-render the components when the state
// changes.
//
// The client also uses better-fetch to make the requests. You can pass the fetch
// configuration to the client.
//
///////////////////////////////////////////////////////////////////////////

export const authClient = createAuthClient({
  // baseURL: ...
  plugins: [
    // stripeClient({ ... }),

    ///////////////////////////////////////////////////////////////////////////
    //
    // Coding In Flow does this at 40:30.
    // This does not affect the default types exported from 'better-auth'
    // import { Session, User } from 'better-auth'
    // Rather, what it does is inform the authClient.useSession() hook.
    //
    //   const value = authClient.useSession()
    //   const { data  } = value
    //   if (!data) { return null  }
    //   const { session, user } = data
    //
    // Now user.role will be recognized, assuming we've correctly implemented
    // user.additionalFields.role in @/lib/auth.ts
    //
    ///////////////////////////////////////////////////////////////////////////

    inferAdditionalFields<typeof auth>(),
    ///////////////////////////////////////////////////////////////////////////
    //
    // Coding In Flow does this at 15:45.
    // Florian indicated that this was important for signIn, signUp from server actions.
    // This seems to imply that nextCookies() will help sync the client when using server actions.
    // Double-check if and why this is important.
    //
    ///////////////////////////////////////////////////////////////////////////
    nextCookies() // nextCookies() is always last!
  ]
})
