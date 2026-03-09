'use client'

import * as React from 'react'
import { toast } from 'sonner'
import { authClient } from '@/lib/auth-client'
import { iconDictionary } from './iconDictionary'
import { cn } from '@/utils'
import type { SupportedOAuthProvider } from '@/types'

type UnlinkButtonProps = React.ComponentProps<'button'> & {
  providerString: SupportedOAuthProvider | 'credential'
  onSuccess: () => void
}

/* ========================================================================

======================================================================== */

export const UnlinkButton = ({ className = '', onSuccess, providerString, ...otherProps }: UnlinkButtonProps) => {
  const [loading, setLoading] = React.useState(false)

  /* ======================
        handleUnlink()
  ====================== */

  // ^ This was what I was doing. The current version has not been tested.

  // const handleUnlink = async (provider: SupportedOAuthProvider | 'credential') => {
  //   setLoading(true)

  //   try {
  //     // https://better-auth.com/docs/concepts/users-accounts#account-unlinking
  //     // If the account doesn't exist, it will throw an error. Additionally, if the
  //     // user only has one account, unlinking will be prevented to stop account lockout
  //     // (unless allowUnlinkingAll is set to true).
  //     const { data, error } = await authClient.unlinkAccount({
  //       providerId: providerString

  //     })

  //     if (error) {
  //       if (error.code === 'FAILED_TO_UNLINK_LAST_ACCOUNT') {
  //         toast.error(
  //           `Error: The ${provider} account is the only account left. Unlinking is prohibited to prevent account lockout.`
  //         )
  //       } else {
  //         toast.error(`Error: Unable to unlink ${provider} account`)
  //       }

  //       return
  //     }

  //     if (data) {
  //       onSuccess?.()
  //       toast.success(`Successfully unlinked the ${provider} account`)
  //       return
  //     }
  //   } catch (_err) {
  //     toast.error(`Error: Unable to unlink ${provider} account`)
  //   } finally {
  //     setLoading(false)
  //   }
  // }

  const handleUnlink = async (provider: SupportedOAuthProvider | 'credential') => {
    setLoading(true)

    try {
      // 1. Find the local account row for this provider
      const { data: accounts, error: listError } = await authClient.listAccounts()

      if (listError || !accounts) {
        toast.error(`Error: Unable to unlink ${provider} account`)
        return
      }

      const account = accounts.find((a) => a.providerId === provider)

      if (!account) {
        toast.error(`Error: No linked ${provider} account found`)
        return
      }

      // 2. Unlink using the local account.id
      const { data, error } = await authClient.unlinkAccount({
        accountId: account.id
      })

      if (error) {
        if (error.code === 'FAILED_TO_UNLINK_LAST_ACCOUNT') {
          toast.error(
            `Error: The ${provider} account is the only account left. Unlinking is prohibited to prevent account lockout.`
          )
        } else {
          toast.error(`Error: Unable to unlink ${provider} account`)
        }
        return
      }

      if (data) {
        onSuccess?.()
        toast.success(`Successfully unlinked the ${provider} account`)
      }
    } catch (_err) {
      toast.error(`Error: Unable to unlink ${provider} account`)
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
          {loading ? 'Unlinking...' : providerString}
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
        handleUnlink(providerString)
      }}
      title={`Unlink from ${providerString}`}
    />
  )
}
