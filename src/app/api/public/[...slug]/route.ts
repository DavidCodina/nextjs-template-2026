import { codes } from '@/utils'

/* ========================================================================

======================================================================== */
// This may be a bit trickier for authenticated routes.

function notFound() {
  return Response.json(
    {
      message: 'The requested API route does not exist.',
      code: codes.NOT_FOUND
    },
    { status: 404, statusText: 'Not Found' }
  )
}

export const GET = notFound
export const POST = notFound
export const PUT = notFound
export const PATCH = notFound
export const DELETE = notFound
export const OPTIONS = notFound
export const HEAD = notFound
