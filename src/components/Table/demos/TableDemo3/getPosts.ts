import type { ResponsePromise } from '@/types'
import { codes, handleError, /* randomFail, */ sleep } from '@/utils'

type Post = {
  userId: number
  id: number
  title: string
  body: string
}

type GetPostsData = Post[] | null
type GetPostsResponsePromise = ResponsePromise<GetPostsData>
type GetPosts = () => GetPostsResponsePromise

/* ======================
        getPost()
====================== */

export const getPosts: GetPosts = async () => {
  try {
    // Simulate a slow response.
    await sleep(1500)

    // if (randomFail(0.5)) {
    //   throw new Error('The request randomly failed.')
    // }

    const res = await fetch(`https://jsonplaceholder.typicode.com/posts?_limit=10`)

    if (!res.ok) {
      return {
        code: codes.INTERNAL_SERVER_ERROR,
        data: null,
        message: `The request failed with a status of ${res.status}.`,
        success: false
      }
    }

    const json = (await res.json()) as GetPostsData

    return {
      code: codes.OK,
      data: json,
      message: 'success',
      success: true
    }
  } catch (err) {
    if (err instanceof Error) {
      return handleError(err, err.message)
    }
    return handleError(err)
  }
}
