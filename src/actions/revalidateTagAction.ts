'use server'

import { revalidateTag } from 'next/cache'
import { codes, handleError } from '@/utils'
import { ResponsePromise } from '@/types'

const immediateProfile = { expire: 0 } as const

type ImmediateProfileType = typeof immediateProfile
type ProfileType = string | ImmediateProfileType

/* ========================================================================
              
======================================================================== */
///////////////////////////////////////////////////////////////////////////
//
// https://nextjs.org/docs/app/api-reference/functions/revalidateTag
//
// revalidateTag allows you to invalidate cached data on-demand for a specific cache tag.
//
// This function is ideal for content where a slight delay in updates is acceptable,
// such as blog posts, product catalogs, or documentation.
//
// Users receive stale content while fresh data loads in the background.
//
// revalidateTag can be called in Server Functions and Route Handlers.
//
// revalidateTag cannot be called in Client Components or Proxy, as it only works in server environments.
//
// revalidateTag does not return a value.
//
// Good to know: The single-argument form revalidateTag(tag) is deprecated.
//
// ⚠️ Good to know: For webhooks or third-party services that need immediate expiration, you can pass { expire: 0 }
// as the second argument: revalidateTag(tag, { expire: 0 }). This pattern is necessary when external systems
// call your Route Handlers and require data to expire immediately. ⚠️ For all other cases, it's recommended
// to use updateTag in Server Actions for immediate updates instead.
//
// Me: This action is used inside of the RevalidateTagButton client component.
// While it's useful to have a dedicated action for relavidating tags, it's much more
// likely that revalidateTag(tag, profile) will be used inside of other mutating actions.
//
///////////////////////////////////////////////////////////////////////////

type RevalidateTagActionData = null
type RevalidateTagActionResponsePromise = ResponsePromise<RevalidateTagActionData>
type RevalidateTagAction = (tag: string, profile?: ProfileType) => RevalidateTagActionResponsePromise

// Because of the kind of apps that I build, I've used immediateProfile as the default,
// rather than the 'max' profile, which is recommended by Next.js
export const revalidateTagAction: RevalidateTagAction = async (tag, profile = immediateProfile) => {
  revalidateTag(tag, profile)

  try {
    return {
      code: codes.OK,
      data: null,
      message: `The ${tag} tag was revalidated.`,
      success: true
    }
  } catch (err) {
    if (err instanceof Error) {
      return handleError(err, err.message)
    }

    return handleError(err)
  }
}
