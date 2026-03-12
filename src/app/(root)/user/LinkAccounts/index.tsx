'use client'

import * as React from 'react'
import { authClient } from '@/lib/auth-client'
import { LinkCredentialsForm } from './LinkCredentialsForm'
import { LinkSocialButton } from './LinkSocialButton'
import { UnLinkSocialButton } from './UnlinkSocialButton'
import { SUPPORTED_OAUTH_PROVIDERS } from '@/lib/constants'
// import { Prisma } from '@/generated/prisma/client'
// ❌ type Account = Prisma.AccountGetPayload<{}>
import type { Account } from 'better-auth/types'
import type { SupportedOAuthProvider } from '@/types'

//# Add icons to buttons.

/* ========================================================================

======================================================================== */
// https://better-auth.com/docs/concepts/users-accounts#manually-linking-accounts
// Much of the logic here is based off of WDS tutorial at 2:27:00 : https://www.youtube.com/watch?v=WPiqNDapQrk

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

export const LinkAccounts = () => {
  const [loadingAccounts, setLoadingAccounts] = React.useState(true)
  const [accounts, setAccounts] = React.useState<Account[] | null>(null)
  const credentialAccount = accounts?.find((account) => account.providerId === 'credential')

  const linkedSocialAccounts = accounts?.filter((account) => account.providerId !== 'credential') ?? []
  const unlinkedSocialAccounts = SUPPORTED_OAUTH_PROVIDERS.filter(
    (provider) => !linkedSocialAccounts.some((a) => a.providerId === provider)
  )

  /* ======================
        useEffect()
  ====================== */
  // This useEffect() reruns after a new social account is linked. Why? Because the
  // page itself remounts when the app redirects back to '/user'.

  React.useEffect(() => {
    setLoadingAccounts(true)
    authClient
      .listAccounts()
      .then((result) => {
        const { data, error } = result

        if (error) {
          //# Add error + Alert with retry button.
          //# setError()
          return result
        }

        if (Array.isArray(data)) {
          setAccounts(data)
        }

        return result
      })

      .catch((_err) => {
        //# Add error + Alert to UI
      })
      .finally(() => {
        setLoadingAccounts(false)
      })
  }, [])

  /* ======================
    renderLinkedAccounts()
  ====================== */

  const renderLinkedAccounts = () => {
    return (
      <div>
        <h3 className='text-primary text-base font-medium'>Linked Accounts:</h3>
        <p className='mb-2 text-sm'>
          Click on an item to <span className='text-destructive font-semibold italic'>unlink</span> the authentication
          provider.
        </p>
        <div className='flex flex-wrap gap-2'>
          {credentialAccount && (
            <UnLinkSocialButton
              onSuccess={() => {
                authClient
                  .listAccounts()
                  .then((result) => {
                    const { data, error } = result

                    if (error) {
                      return result
                    }

                    if (Array.isArray(data)) {
                      setAccounts(data)
                    }

                    return result
                  })
                  .catch((_err) => {})
                  .finally(() => {})
              }}
              providerString={'credential'}
            />
          )}
          {linkedSocialAccounts.map((account) => {
            return (
              <UnLinkSocialButton
                key={account.id}
                onSuccess={() => {
                  authClient
                    .listAccounts()
                    .then((result) => {
                      const { data, error } = result

                      if (error) {
                        return result
                      }

                      if (Array.isArray(data)) {
                        setAccounts(data)
                      }

                      return result
                    })
                    .catch((_err) => {})
                    .finally(() => {})
                }}
                providerString={account.providerId as SupportedOAuthProvider}
              />
            )
          })}
        </div>
      </div>
    )
  }

  /* ======================
  renderUnlinkedSocialAccounts()
  ====================== */

  const renderUnlinkedSocialAccounts = () => {
    if (!Array.isArray(unlinkedSocialAccounts) || unlinkedSocialAccounts.length === 0) {
      return null
    }

    return (
      <div>
        <h3 className='text-primary text-base font-medium'>Unlinked Social Accounts:</h3>
        <p className='mb-2 text-sm'>
          Click on an item to <span className='text-success font-semibold italic'>link</span> the authentication
          provider.
        </p>
        <div className='flex flex-wrap gap-2'>
          {unlinkedSocialAccounts.map((providerString, index) => {
            return (
              <LinkSocialButton key={index} providerString={providerString}>
                {providerString}
              </LinkSocialButton>
            )
          })}
        </div>
      </div>
    )
  }

  /* ======================
  renderLinkCredentialsForm()
  ====================== */

  const renderLinkCredentialsForm = () => {
    if (loadingAccounts || credentialAccount) {
      return null
    }

    return (
      <div>
        <h3 className='text-primary text-base font-medium'>Unlinked Credential Account:</h3>

        <p className='mb-2 text-sm'>
          Add password to <span className='text-success font-semibold italic'>link</span> credential provider
          (email/password) against the email already on record.
        </p>
        <LinkCredentialsForm
          onSuccess={() => {
            authClient
              .listAccounts()
              .then((result) => {
                const { data, error } = result

                if (error) {
                  return result
                }

                if (Array.isArray(data)) {
                  setAccounts(data)
                }

                return result
              })
              .catch((_err) => {})
              .finally(() => {})
          }}
        />
      </div>
    )
  }

  /* ======================
      renderContent() 
  ====================== */

  const renderContent = () => {
    if (loadingAccounts) {
      return <div className='text-primary my-12 text-center text-4xl font-black'>Loading...</div>
    }

    return (
      <section className='mb-6 space-y-6'>
        {renderLinkedAccounts()}
        {renderUnlinkedSocialAccounts()}
        {renderLinkCredentialsForm()}
      </section>
    )
  }

  /* ======================
          return
  ====================== */

  return renderContent()
}
