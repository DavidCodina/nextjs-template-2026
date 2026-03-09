import { codes } from '@/utils'

/* ========================================================================

======================================================================== */

export async function GET(_req: Request) {
  try {
    /* ======================
            Response
    ====================== */

    return Response.json({
      test: 'Hello, Next.js!'
    })
  } catch (_err) {
    return Response.json(
      {
        message: 'An error occurred on the server.',
        code: codes.INTERNAL_SERVER_ERROR
      },
      {
        status: 500,
        statusText: 'Internal Server Error'
      }
    )
  }
}
