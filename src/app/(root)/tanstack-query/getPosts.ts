import {
  // randomFail,
  sleep
} from '@/utils'

export type Post = { id: number; title: string; body: string }

/* ========================================================================
              
======================================================================== */

export const getPosts = async (): Promise<Post[]> => {
  await sleep(2000)

  const res = await fetch('https://jsonplaceholder.typicode.com/posts?_limit=10')

  if (!res.ok) throw new Error('Failed to fetch posts')

  // if (randomFail()) {
  //   throw new Error('A random failure occurred.')
  // }

  const json = await res.json()
  return json as Post[]
}
