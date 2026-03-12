'use client'

import { authClient } from '@/lib/auth-client'
import { Button } from '@/components'

/* ========================================================================

======================================================================== */

// https://better-auth.com/docs/concepts/users-accounts#manually-linking-accounts

// If you want your users to be able to link a social account with a different email
// address than the user, or if you want to use a provider that does not return email
// addresses, you will need to enable this in the account linking settings.

//` We want to get the user's current accounts.
//` Then have a list for all allowed OAuth providers.
//` Then for any OAuth provider that is not already in the list of current user accounts,
//` create a button that allows the user to link the accounts
//` What I currently have is a rudimentary approach.
//` Review WDS tutorial at 2:27:

///////////////////////////////////////////////////////////////////////////
//
// ⚠️ Account Linking vs Account Merging:
//
// Actual account merging is more of a manual process that you have to implement against your database.
// This would be the case when you already two distinct user records.
//
// Better Auth's linkSocial + allowDifferentEmails works cleanly when linking a fresh provider that
// hasn't been used yet. When both sides already exist as independent users, you're in merge territory
// and need to handle it with direct database operations. This is a common gap in auth libraries
// — merging is inherently product-specific because only you know what other data needs to be migrated
// alongside the user record.
//
//! Test what would happen if you had a separate GitHub account and Gmail account, then
//! tried to Link Google social from within Github account.
//! Better Auth will likely throw a conflict error rather than silently re-home the account.
//
///////////////////////////////////////////////////////////////////////////

export const LinkSocialAccounts = () => {
  // ⚠️ If you're already logged into your associated provider, the process will occur immediately.
  // However, if you're not logged in, then you'll be promted to login first.
  // There's potential here for an end user to inadvertently link to an account that is NOT theirs.
  // This is why it's important to have the capability to unlink as well as view linked accounts.
  const handleLinkSocial = async (provider: 'google' | 'github' | 'linkedin') => {
    try {
      /* const { data, error } = */ await authClient.linkSocial({
        provider: provider,
        callbackURL: '/user' // Callback URL after linking completes - defaults to '/'
      })

      //# toast ???
    } catch (_err) {
      //# toast ???
      // console.log('\nError from authClient.linkSocial()', _err)
    }
  }

  /* ======================
          return
  ====================== */

  return (
    <>
      <Button
        onClick={() => {
          handleLinkSocial('google')
        }}
      >
        Link Google
      </Button>
    </>
  )
}
