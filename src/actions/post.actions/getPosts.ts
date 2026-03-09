'use server'

import { prisma } from '@/lib/db/prisma'
import { ResponsePromise } from '@/types'
import { codes, serializeData, sleep } from '@/utils'
import { Prisma } from '@/generated/prisma/client'

type PrismaPost = Prisma.PostGetPayload<{}>
type Post = Omit<PrismaPost, 'createdAt' | 'updatedAt'> & {
  createdAt: string
  updatedAt: string
}

type Data = Post[]
export type GetPostsResponsePromise = ResponsePromise<Data | null>
export type GetPosts = () => GetPostsResponsePromise
export type GetPostsResolvedResponse = Awaited<GetPostsResponsePromise>

/* ======================

====================== */
///////////////////////////////////////////////////////////////////////////
//
// Technically, server actions for queries is an anti-pattern.
// The main argument against it is that server actions are queued, not parallel.
// However, for simple use cases, this still works fine.
//
// Usage:
//
//   'use client'
//   import { useState } from 'react'
//   import { Button } from '@/components'
//   import { getPosts } from '@/actions'
//
//   export const ClientComponent = () => {
//     const [posts, setPosts] = useState<unknown[] | null>(null)
//
//     const handleGetPosts = async () => {
//       const { data, success } = await getPosts()
//       if (success === true && Array.isArray(data)) { setPosts(data) }
//     }
//
//     return (
//       <div>
//         <Button className='mx-auto mb-6 flex' onClick={handleGetPosts} size='sm' variant='success'>Get Posts</Button>
//         {posts && (
//           <pre className='bg-card mx-auto w-fit max-w-full overflow-x-auto rounded-lg border p-6 text-sm shadow-sm'>
//             <code>{JSON.stringify(posts, null, 2)}</code>
//           </pre>
//         )}
//       </div>
//     )
//   }
//
///////////////////////////////////////////////////////////////////////////

export const getPosts: GetPosts = async () => {
  await sleep(1000)
  try {
    const posts = await prisma.post.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    })

    ///////////////////////////////////////////////////////////////////////////
    //
    // ⚠️ Gotcha:
    //
    //   ❌ Only plain objects can be passed to Client Components from Server Components.
    //      Objects with symbol properties like nodejs.util.inspect.custom are not supported.
    //
    ///////////////////////////////////////////////////////////////////////////

    const serializedPosts = serializeData(posts)

    return {
      code: codes.OK,
      data: serializedPosts,
      message: 'success',
      success: true
    }
  } catch (_err) {
    return {
      code: codes.INTERNAL_SERVER_ERROR,
      data: null,
      message: 'server error',
      success: false
    }
  }
}
