'use server'

import { prisma } from '@/lib/db/prisma'
import { ResponsePromise } from '@/types'
import { codes, formatZodErrors, serializeData, sleep } from '@/utils'
import { Prisma } from '@/generated/prisma/client'
import { z } from 'zod'

type PostCreateInput = Pick<Prisma.PostCreateInput, 'title' | 'body'>

type PrismaPost = Prisma.PostGetPayload<{}>
type Post = Omit<PrismaPost, 'createdAt' | 'updatedAt'> & {
  createdAt: string
  updatedAt: string
}

type Data = Post
export type CreatePostResponsePromise = ResponsePromise<Data | null>
export type CreatePost = (input: PostCreateInput) => CreatePostResponsePromise
export type CreatePostsResolvedResponse = Awaited<CreatePostResponsePromise>

const CreatePostSchema = z.object({
  title: z.string().trim().min(1, { message: 'Title is required' }),
  body: z.string().trim().min(1, { message: 'Body is required' })
})

/* ======================

====================== */

export const createPost: CreatePost = async (input) => {
  await sleep(1000)
  const { data: zodData, error: zodError, success: zodSuccess } = CreatePostSchema.safeParse(input)

  if (zodSuccess === false) {
    const formattedZodErrors = formatZodErrors(zodError)
    return {
      code: codes.BAD_REQUEST,
      data: null,
      errors: formattedZodErrors,
      message: 'Invalid input data',
      success: false
    }
  }

  try {
    const newPost = await prisma.post.create({
      data: {
        title: zodData.title,
        body: zodData.body
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

    const serializedNewPost = serializeData(newPost)

    return {
      code: codes.CREATED,
      data: serializedNewPost,
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
