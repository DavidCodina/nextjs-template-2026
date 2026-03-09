'use server'

import { prisma } from '@/lib/db/prisma'
import { ResponsePromise } from '@/types'
import { codes, formatZodErrors, serializeData, sleep } from '@/utils'
import { Prisma } from '@/generated/prisma/client'
import { z } from 'zod'

type PrismaPost = Prisma.PostGetPayload<{}>
type Post = Omit<PrismaPost, 'createdAt' | 'updatedAt'> & {
  createdAt: string
  updatedAt: string
}

type Data = Post
export type GetPostResponsePromise = ResponsePromise<Data | null>
export type GetPost = (id: string) => GetPostResponsePromise
export type GetPostResolvedResponse = Awaited<GetPostResponsePromise>

const IdSchema = z.object({
  id: z.uuid()
})

/* ======================

====================== */

export const getPost: GetPost = async (id) => {
  await sleep(1000)

  const { data: zodData, error: zodError, success: zodSuccess } = IdSchema.safeParse({ id })

  if (zodSuccess === false) {
    const formattedZodErrors = formatZodErrors(zodError)
    return {
      code: codes.BAD_REQUEST,
      data: null,
      errors: formattedZodErrors,
      message: 'The id must be a valid uuid.',
      success: false
    }
  }

  try {
    const post = await prisma.post.findUnique({
      where: { id: zodData.id }
    })

    // findUnique() returns the post or null if nothing matches.
    if (!post) {
      return {
        code: codes.NOT_FOUND,
        data: null,
        message: 'Resource not found',
        success: false
      }
    }

    const serializedPost = serializeData(post)

    return {
      code: codes.OK,
      data: serializedPost,
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
