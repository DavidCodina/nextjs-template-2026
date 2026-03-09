import { codes, handleError } from '@/utils'

/* ========================================================================

======================================================================== */

export async function GET(_req: Request) {
  try {
    /* ======================
            Response
    ====================== */

    return Response.json({
      code: codes.OK,

      data: {
        test: 'Hello, Next.js!'
      },
      message: 'Success.',
      success: true
    })
  } catch (err) {
    // if (err instanceof Error) { console.log({ name: err.name, message: err.message }) }
    return Response.json(handleError(err), {
      status: 500
    })
  }
}
