'use client'

import { authClient } from '@/lib/auth-client'
import { Button } from '@/components'

/* ========================================================================

======================================================================== */

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
