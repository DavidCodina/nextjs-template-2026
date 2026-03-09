'use server'

// 'use cache'npm
// ❌ Conflicting directives "use server" and "use cache" found in the same file. You cannot place both directives at the top of a file. Please remove one of them.

import {
  // cacheLife, // https://nextjs.org/docs/app/api-reference/functions/cacheLife
  cacheTag // https://nextjs.org/docs/app/api-reference/functions/cacheTag
} from 'next/cache'
import { codes, handleError, randomTrue /*, randomFail */ } from '@/utils'
import { ResponsePromise } from '@/types'

const getTime = () => {
  return new Date().toLocaleTimeString('en-US', {
    hour12: true,
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit'
  })
}

/* ========================================================================
              
======================================================================== */

type GetPostsData = Record<string, any>[] | null
type GetPostsResponsePromise = ResponsePromise<GetPostsData>
type GetPosts = () => GetPostsResponsePromise

export const getPosts: GetPosts = async () => {
  'use cache'
  cacheTag('posts')

  try {
    // await sleep(1500)

    // if (randomFail(0.5)) {
    //   throw new Error('The request randomly failed.')
    // }

    const limit = randomTrue() ? 3 : 5
    const res = await fetch(`https://jsonplaceholder.typicode.com/posts?_limit=${limit}`)

    // This is also a best practice for fetch() requests.
    // fetch() only throws for network errors (e.g., DNS lookup fails,
    // no internet connection, CORS rejection).
    if (!res.ok) {
      // throw new Error(`The request failed with a status of ${res.status}.`)
      return {
        code: codes.INTERNAL_SERVER_ERROR,
        data: null,
        message: `The request failed with a status of ${res.status}.`,
        success: false
      }
    }

    const json = (await res.json()) as GetPostsData
    const time = getTime()

    return {
      code: codes.OK,
      data: json,
      message: `${time}`,
      success: true
    }
  } catch (err) {
    if (err instanceof Error) {
      return handleError(err, err.message)
    }

    return handleError(err)
  }
}

/* ========================================================================
              
======================================================================== */

type GetPostData = Record<string, any> | null
type GetPostResponsePromise = ResponsePromise<GetPostData>
type GetPost = (postId: string) => GetPostResponsePromise

export const getPost: GetPost = async (postId) => {
  'use cache'
  cacheTag(`post-${postId}`)

  try {
    const res = await fetch(`https://jsonplaceholder.typicode.com/posts/${postId}`)

    if (!res.ok) {
      return {
        code: codes.INTERNAL_SERVER_ERROR,
        data: null,
        message: `The request failed with a status of ${res.status}.`,
        success: false
      }
    }

    const json = (await res.json()) as GetPostData
    const time = getTime()

    // jsonplaceholder will simply return an empty object if you pass in a nonexistent userId.
    // For the sake of this demo, I have decided to return a 404 instead.
    if (!json || typeof json !== 'object' || Object.keys(json).length === 0) {
      return {
        code: codes.NOT_FOUND,
        data: null,
        message: `The request for posts failed with a status of ${404}.`,
        success: false
      }
    }

    return {
      code: codes.OK,
      data: json,
      message: `${time}`,
      success: true
    }
  } catch (err) {
    if (err instanceof Error) {
      return handleError(err, err.message)
    }

    return handleError(err)
  }
}
