import { codes, handleError } from '@/utils'

/* ========================================================================

======================================================================== */

export async function POST(req: Request) {
  // If fetch() omits Content-Type, it will default to 'text/plain;charset=UTF-8'
  const contentType = req.headers.get('content-type') || ''
  // console.log({ contentType: req.headers.get('content-type') })

  /* ======================
    Content-Type Check
  ====================== */
  ///////////////////////////////////////////////////////////////////////////
  //
  // Generally, it's a best practice to explicitly set the Content-Type in the fetch request.
  //
  //   {
  //     method: 'POST',
  //     headers: { 'Content-Type': 'application/json' },
  //     body: JSON.stringify(requestData)
  //   }
  //
  // fetch() will not infer 'application/json' if you omit the Content-Type header.
  // However, the standard Web API Request.json() will still work because it's lenient.
  //
  //   - It reads the request body and attempts to parse it as JSON
  //   - It ignores the Content-Type header - it only cares whether the body content is valid JSON
  //   - If the body is valid JSON, it parses successfully regardless of what Content-Type says (or if it's missing)
  //
  // That said, one could argue that it's overkill. However, it enforces best practices, and It trains front-end
  // developers (and any API consumers) to set headers correctly.
  //
  ///////////////////////////////////////////////////////////////////////////

  if (!contentType.includes('application/json')) {
    return Response.json(
      {
        code: codes.UNSUPPORTED_MEDIA_TYPE,
        data: null,
        message: 'Expected Content-Type application/json',
        success: false
      },
      { status: 415 }
    )
  }

  try {
    /* ======================
      Request Body Check
    ====================== */
    let reqBody: any
    // Preempt: { name: 'SyntaxError', message: 'Unexpected end of JSON input' }
    // This is more of a convenience feature. If we omit this inner try/catch block,
    // it would just go to the outer catch, but the error message would not be as precise.

    try {
      reqBody = await req.json()
    } catch {
      return Response.json(
        {
          code: codes.BAD_REQUEST,
          data: null,
          message: 'Bad Request: Invalid request body.',
          success: false
        },
        { status: 400 }
      )
    }

    const time = new Date().toLocaleTimeString('en-US', {
      hour12: true,
      hour: 'numeric',
      minute: '2-digit',
      second: '2-digit'
    })

    /* ======================
            Response
    ====================== */

    return Response.json({
      code: codes.OK,
      data: {
        ...reqBody,
        time
      },

      message: 'Success.',
      success: true
    })
  } catch (err) {
    // if (err instanceof Error) { console.log({ name: err.name, message: err.message }) }
    return Response.json(handleError(err, 'Internal server error. (from server API route)'), { status: 500 })
  }
}
