// These are NOT server actions! They're server functions (AKA server utility functions).
// There's a difference. These are async fetch functions that ONLY get called on the server.
// They're merely abstractions, rather than running the logic directly in a server component.
// Consequently, we're not breaking the rules, which say server actions should only be used
// for mutations. Technically, that's arguable, but we're still following best practices here.
// ❌  'use server'

import 'server-only'

import {
  // cacheLife, // https://nextjs.org/docs/app/api-reference/functions/cacheLife
  cacheTag // https://nextjs.org/docs/app/api-reference/functions/cacheTag
} from 'next/cache'
import {
  codes,
  handleError,

  // randomFail,
  randomTrue,
  sleep
} from '@/utils'
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
  'use cache' // AKA 'make static'
  cacheTag('posts')

  try {
    await sleep(2500)
    // if (randomFail()) {
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

  await sleep(1500)

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
