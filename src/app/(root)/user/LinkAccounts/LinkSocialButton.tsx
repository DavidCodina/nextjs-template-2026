'use client'

import * as React from 'react'
import { toast } from 'sonner'
import { authClient } from '@/lib/auth-client'
import { iconDictionary } from './iconDictionary'
import { cn } from '@/utils'
import type { SupportedOAuthProvider } from '@/types'

type LinkSocialButtonProps = React.ComponentProps<'button'> & {
  providerString: SupportedOAuthProvider
}

/* ========================================================================

======================================================================== */

export const LinkSocialButton = ({ className = '', providerString, ...otherProps }: LinkSocialButtonProps) => {
  // In practice, the loading state is actually not needed because any time a request is made to link
  // a social account, it will redirect to the OAuth provider, then redirect back to the app.
  const [loading, setLoading] = React.useState(false)

  /* ======================
      handleLinkSocial()
  ====================== */
  ///////////////////////////////////////////////////////////////////////////
  //
  // ⚠️ If you're already logged into your associated provider, the process will occur immediately.
  // However, if you're not logged in, then you'll be promted to login first.
  // There's potential here for an end user to inadvertently link to an account that is NOT theirs.
  // This is why it's important to have the capability to unlink as well as view linked accounts.
  //
  // If you want your users to be able to link a social account with a different email
  // address than the user, or if you want to use a provider that does not return email
  // addresses, you will need to enable this in auth.ts:
  //
  //   account: { accountLinking: { allowDifferentEmails: true } }
  //
  ///////////////////////////////////////////////////////////////////////////

  const handleLinkSocial = async (provider: SupportedOAuthProvider) => {
    setLoading(true)

    try {
      const { data, error } = await authClient.linkSocial({
        provider: provider,
        callbackURL: '/user' // Callback URL after linking completes - defaults to '/'
      })

      if (error) {
        toast.error(`Error: Unable to link social account: ${provider}`)
        return
      }

      // ⚠️ This is misleading. It fires just before a successful redirect to the
      // OAuth provider, rather than after a successful linking to the provider.
      if (data) {
        toast.success(`Successfully linked social account: ${provider}`)
        return
      }
    } catch (_err) {
      toast.error(`Error: Unable to link social account: ${provider}`)
    } finally {
      setLoading(false)
    }
  }

  /* ======================
          return
  ====================== */

  return (
    <button
      {...otherProps}
      children={
        <>
          {iconDictionary[providerString as keyof typeof iconDictionary] || iconDictionary.default}
          {loading ? 'Linking...' : providerString}
        </>
      }
      className={cn(
        'bg-card flex cursor-pointer items-center gap-2 rounded border px-2 py-1 text-sm select-none',
        className,
        loading && 'pointer-events-none'
      )}
      onClick={() => {
        if (loading) {
          return
        }
        handleLinkSocial(providerString)
      }}
      title={`Link to ${providerString}`}
    />
  )
}
