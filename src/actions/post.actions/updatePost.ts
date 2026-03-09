'use server'

import { prisma } from '@/lib/db/prisma'
import { ResponsePromise } from '@/types'
import { codes, formatZodErrors, serializeData, sleep } from '@/utils'
import { Prisma } from '@/generated/prisma/client'
import { z } from 'zod'

type PostUpdateInput = Partial<Pick<Prisma.PostUpdateInput, 'title' | 'body'>>

type PrismaPost = Prisma.PostGetPayload<{}>
type Post = Omit<PrismaPost, 'createdAt' | 'updatedAt'> & {
  createdAt: string
  updatedAt: string
}

type Data = Post
export type UpdatePostResponsePromise = ResponsePromise<Data | null>
export type UpdatePost = (id: string, input: PostUpdateInput) => UpdatePostResponsePromise
export type UpdatePostResolvedResponse = Awaited<UpdatePostResponsePromise>

const IdSchema = z.object({
  id: z.uuid()
})

const UpdatePostSchema = z
  .object({
    title: z.string().trim().min(1, 'Title must be a non-empty string').optional(),
    body: z.string().trim().min(1, 'Body must be a non-empty string').optional()
  })

  ///////////////////////////////////////////////////////////////////////////
  //
  // Some teams may prefer to treat this case as a valid no-op, which
  // would follow the letter of PATCH semantics: “apply these changes,”
  // and there are no changes to apply. It’s also idempotent and harmless.
  // However, here I'm sending back a 400 just for the sake of example.
  //
  //   if (Object.keys(body).length === 0) { ... }
  //
  // But actualy, a better approach is to check for specific properties.
  // This mitigates potential typos on the client side.
  //
  ///////////////////////////////////////////////////////////////////////////

  .refine((data) => data.title !== undefined || data.body !== undefined, {
    message: 'At least one of `title` or `body` must be provided'
  })

/* ======================

====================== */

export const updatePost: UpdatePost = async (id, input) => {
  await sleep(1000)

  const idResult = IdSchema.safeParse({ id })

  if (idResult.success === false) {
    const formattedZodErrors = formatZodErrors(idResult.error)
    return {
      code: codes.BAD_REQUEST,
      data: null,
      errors: formattedZodErrors,
      message: 'The id must be a valid uuid.',
      success: false
    }
  }

  const { data: zodData, error: zodError, success: zodSuccess } = UpdatePostSchema.safeParse(input)

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

  // Only include the fields that were actually sent
  const updatePostInput: PostUpdateInput = {}
  if (zodData.title !== undefined) updatePostInput.title = zodData.title
  if (zodData.body !== undefined) updatePostInput.body = zodData.body

  try {
    // prisma.post.update() throws if no record matches the where clause.
    const updatedPost = await prisma.post.update({
      where: {
        id: idResult.data.id
      },
      data: updatePostInput
    })

    const serializedPost = serializeData(updatedPost)

    return {
      code: codes.UPDATED,
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
