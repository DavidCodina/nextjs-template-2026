'use server'

import { prisma } from '@/lib/db/prisma'

/* ======================

====================== */

export async function getPosts() {
  try {
    const posts = await prisma.post.findMany()

    return {
      data: posts,
      message: 'success',
      success: true
    }
  } catch (_err) {
    return {
      data: null,
      message: 'server error',
      success: false
    }
  }
}
