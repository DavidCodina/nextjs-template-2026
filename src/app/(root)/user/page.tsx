import type { Metadata } from 'next'

import { /* Authenticated, */ Page, PageContainer, Title } from '@/components'
import { DynamicProfile } from './Profile'

// import { DynamicProfile } from './Profile/DynamicProfile'
// import { ServerSession } from './ServerSession'
// import { ClientSession } from './ClientSession'
// import { LinkAccounts } from './LinkAccounts'

export const metadata: Metadata = {
  title: {
    absolute: 'User'
  },
  description: 'The User Page'
}

//# Complete src/app/api/protected/route.ts

//# Create a getCurrentUser server action.
//# In this case, we may want for it to only return User | null.

//# Add back various actions from the legacy src/actions

//# Update LoginForm to show/hide password

//# Update RegisterForm form to show/hide password/confirmPassword

/* ========================================================================
                                  PageUser
======================================================================== */

//# Password Reset Flow:
//#   - Syntax at 6:50,

//# Admin Plugin
//# This plugin looks super cool. Work on this as a bonus after just doing
//# your custom role implementation.
//#  - Syntax at 17:10,

//# Review tweakcn.com

//# Research if there is a way to change the values passed
//# to the server or client-side signUp function.
//# How do we make it firstName, lastName?

//# Review signUpSchema in Coding in Flow tutorial at 17:38
//# Could also review signInSchema. Check out source code directly.

//# Review documentation on Session Expiration
//# Go to BETTER-AUTH Sessions tab:
//# The session expires after 7 days by default. But whenenver te session
//# is used and the updateAge is reached, the session expiration is updated
//# to the current time plus the expiresIn value. You can change both the expiresIn
//# adn updateAge values by passing the session object to the auth configuration.
//# DC: In theory, I think this eliminates the need for refresh tokens.
//# If the user doesn't log in for 7 days, they get logged out automatically.

//# Review the Rate Limit tab as well, this is a cool feature.

//# Complete ProtectedActionDemo (in components)
//# This is done in a manner similar to server components.
//# See Coding in Flow at 50:00.
//# Interestingly, he also uses unauthorized() and forbidden() within
//# the server action. Apparently, when done in an action they return
//# 401 and 403 respectively, rather than redirecting to the associated
//# error pages. However, this assumes you're not using a try/catch block,
//# which I think is the best practice.

//# Create a Role component (or whatevs) similar to in Clerk.
//# Coding In Flow starts discussing roles around 47:45. He uses:
//#   if (!user) unauthorized()
//#   if (user.role !== 'ADMIN') forbidden()

const PageUser = async () => {
  /* ======================
          return
  ====================== */

  return (
    // <Authenticated>
    <Page>
      <PageContainer>
        <Title
          as='h2'
          style={{
            marginBottom: 50,
            textAlign: 'center'
          }}
        >
          User
        </Title>

        <DynamicProfile />

        {/* <LinkAccounts /> */}

        {/* <ServerSession /> */}
        {/* <Suspense><ClientSession /></Suspense> */}
      </PageContainer>
    </Page>
    // </Authenticated>
  )
}

export default PageUser
