'use server'

import { updateTag } from 'next/cache'
import { codes, handleError } from '@/utils'
import { ResponsePromise } from '@/types'

/* ========================================================================
              
======================================================================== */
///////////////////////////////////////////////////////////////////////////
//
// https://nextjs.org/docs/app/api-reference/functions/updateTag
//
// This action is used inside of the UpdateTagButton client component.
// While it's useful to have a dedicated action for updating tags, it's much more
// likely that updateTag(tag) will be used inside of other mutating actions.
//
// Remember if you update a post, you must update the 'posts' tag as well as `post-${postId}`.
// What about when the post is deleted? There is actually no mechanism for removing a cache entry.
// At first, this seemed like an issue. However, my current understanding is that Next.js 16
// cache expiration follows a lazy/on-demand revalidation pattern. It does NOT proactively refetch
// in the background. That said, I don't think expired cache entries are automatically deleted.
// Rather, they are eventually evicted by LRU when cache needs space. Physical removal happens via
// LRU eviction when memory pressure requires it. So... There is a cleanup mechanism, but it's not
// as simple as expired = deleted.
//
//
// Behavior: When you trigger this action from UI, it will immediately update the
// data on the server. You DO NOT first need to go to a page that uses the data to
// trigger it. Moreover, if you're currently on a page with the data, it will refresh
// it under the hood and then give you new data in real-time. However, the update will
// not trigger the Suspense fallback a second time.
//
///////////////////////////////////////////////////////////////////////////

type UpdateTagActionData = null
type UpdateTagActionResponsePromise = ResponsePromise<UpdateTagActionData>
type UpdateTagAction = (tag: string) => UpdateTagActionResponsePromise

export const updateTagAction: UpdateTagAction = async (tag) => {
  updateTag(tag)

  try {
    return {
      code: codes.OK,
      data: null,
      message: `The ${tag} tag was updated.`,
      success: true
    }
  } catch (err) {
    if (err instanceof Error) {
      return handleError(err, err.message)
    }

    return handleError(err)
  }
}
