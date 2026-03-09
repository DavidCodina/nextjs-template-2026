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
export type DeletePostResponsePromise = ResponsePromise<Data | null>
export type DeletePost = (id: string) => DeletePostResponsePromise
export type DeletePostResolvedResponse = Awaited<DeletePostResponsePromise>

const IdSchema = z.object({
  id: z.uuid()
})

/* ======================

====================== */

export const deletePost: DeletePost = async (id) => {
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
    // prisma.post.delete() throws if no record matches the where clause.
    const post = await prisma.post.delete({
      where: { id: zodData.id }
    })

    const serializedPost = serializeData(post)

    return {
      code: codes.DELETED,
      data: serializedPost,
      message: 'success',
      success: true
    }
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2025') {
      return {
        code: codes.NOT_FOUND,
        data: null,
        message: 'Resource not found',
        success: false
      }
    }

    return {
      code: codes.INTERNAL_SERVER_ERROR,
      data: null,
      message: 'server error',
      success: false
    }
  }
}
