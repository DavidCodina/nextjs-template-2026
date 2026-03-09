import {
  // cacheLife,
  cacheTag
} from 'next/cache'
import 'server-only'
import { randomFail, sleep } from '@/utils'

export type Post = {
  id: number
  title: string
  body: string
}

export async function getPosts(): Promise<Post[]> {
  'use cache'

  cacheTag(`my-posts`)
  await sleep(2000)

  ///////////////////////////////////////////////////////////////////////////
  //
  //  Generally, a 'use cache' function only creates or updates a cache entry when it
  // completes successfully and returns a value. If it throws, that failed execution
  // is not cached, so the next call executes the function again. This is important because if
  // your function  uses a try/catch, then you'd need gracefully return errors as data, then you'd
  // need some check for those errors and rethrow in the component itself.
  //
  ///////////////////////////////////////////////////////////////////////////

  if (randomFail()) {
    throw new Error('The posts service had a temporary problem.')
  }

  const res = await fetch('https://jsonplaceholder.typicode.com/posts?_limit=6', {
    cache: 'no-store'
  })

  if (!res.ok) {
    throw new Error(`Posts request failed with status ${res.status}.`)
  }

  const json = await res.json()

  return json as Post[]
}

/* ========================================================================
              
======================================================================== */

export const PostList = async () => {
  const posts = await getPosts()

  // if (randomFail()) {
  //   throw new Error('No today dummy!')
  // }

  return (
    <div className='grid gap-4 sm:grid-cols-2'>
      {posts.map((post) => (
        <article
          key={post.id}
          className='border-border/70 bg-card rounded-2xl border p-5 shadow-sm transition-shadow hover:shadow-md'
        >
          <div className='text-muted-foreground mb-4 flex items-center justify-between text-xs font-medium tracking-[0.18em] uppercase'>
            <span>Post</span>
            <span className='bg-muted rounded-full px-2.5 py-1 tracking-normal'>#{post.id}</span>
          </div>
          <h3 className='text-card-foreground text-lg leading-snug font-semibold'>{post.title}</h3>
          <p className='text-muted-foreground mt-3 text-sm leading-6'>{post.body}</p>
        </article>
      ))}
    </div>
  )
}
