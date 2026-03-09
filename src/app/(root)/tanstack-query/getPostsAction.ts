'use server'

import {
  // isServer,
  // randomFail,
  sleep
} from '@/utils'

export type Post = { id: number; title: string; body: string }

/* ========================================================================
              
======================================================================== */
///////////////////////////////////////////////////////////////////////////
//
// This function is almost identical to the normal getPosts() function:
//
//   export const getPosts = async (): Promise<Post[]> => {
//     const res = await fetch('https://jsonplaceholder.typicode.com/posts?_limit=10')
//     if (!res.ok) throw new Error('Failed to fetch posts')
//     const json = await res.json()
//     return json as Post[]
//   }
//
// The only meaningful difference is that it's a server action.
// Obviously, it's contrived and essentially just a proxy endpoint.
// The point here is only to demonstrate that getPostsAction()
// can be consumed by TanStack Query on the client.
//
//   queryFn: async () => {
//     await Promise.resolve()
//     return getPostsAction()
//   }
//
// That said, it's pretty hacky.
//
///////////////////////////////////////////////////////////////////////////

export const getPostsAction = async (): Promise<Post[]> => {
  // if (isServer()) {
  //   console.log('getPostsAction() called on the server.')
  // } else {
  //   console.log('getPostsAction() called on the client.')
  // }

  await sleep(2000)

  const res = await fetch('https://jsonplaceholder.typicode.com/posts?_limit=10')

  if (!res.ok) throw new Error('Failed to fetch posts')

  // if (randomFail()) {
  //   throw new Error('A random failure occurred.')
  // }

  const json = await res.json()
  return json as Post[]
}
