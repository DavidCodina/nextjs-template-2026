import { NextRequest /*, NextResponse */ } from 'next/server'

// https://nextjs.org/docs/15/app/api-reference/file-conventions/route#headers
// https://nextjs.org/docs/15/app/api-reference/functions/headers
import { headers } from 'next/headers'

// https://nextjs.org/docs/15/app/api-reference/file-conventions/route#cookies
// https://nextjs.org/docs/15/app/api-reference/functions/cookies
import { cookies } from 'next/headers'
import { codes, handleError, searchParamsToObject } from '@/utils'

// This is no longer necessary in v15.
// export const dynamic = 'force-dynamic'

/* ========================================================================

======================================================================== */
///////////////////////////////////////////////////////////////////////////
//
// This demo looks at:
//
//   1. Getting query params.
//   2. Getting/Setting headers.
//   3. Getting/Setting cookies.
//
// Usage: http://localhost:3000/api/public/search-params-demo?test=abc123
//
///////////////////////////////////////////////////////////////////////////

export async function GET(request: NextRequest) {
  // https://nextjs.org/docs/app/api-reference/functions/next-request#nexturl
  const searchParams: URLSearchParams = request.nextUrl.searchParams
  const testSearchParam = searchParams.get('test')

  const searchParamsObject = searchParamsToObject(searchParams)

  console.log('\n------------------------------\n', searchParamsObject, '\n------------------------------\n')

  try {
    // In Postman, create a cookie:
    // testCookie=myTestCookie; Path=/; Expires=Sun, 18 Jan 2026 18:23:17 GMT;

    // Getting cookie approach 1:
    // ⚠️ In this approach,  path: '/' is not included.
    // const cookies = request.cookies
    // const testCookie = cookies.get('testCookie') // => { "name": "testCookie", "value": "myTestCookie" }

    // Getting cookeis approach 2:
    const cookieStore = await cookies()

    // Other methods include .has() and .delete()
    const testCookie = cookieStore.get('testCookie') // =>  { name: 'testCookie', value: 'myTestCookie', path: '/' }

    ///////////////////////////////////////////////////////////////////////////
    //
    // Get headers approach 1:
    //
    // console.log(request.headers)
    //
    // Headers {
    //   'user-agent': 'PostmanRuntime/7.43.0',
    //   accept: '*/*',
    //   'postman-token': '79e80d2a-8240-4c80-a4be-a6c1d17fca12',
    //   host: 'localhost:3000',
    //   'accept-encoding': 'gzip, deflate, br',
    //   connection: 'keep-alive',
    //   'x-forwarded-host': 'localhost:3000',
    //   'x-forwarded-port': '3000',
    //   'x-forwarded-proto': 'http',
    //   'x-forwarded-for': '::1',
    //   'x-pathname': '/api/param-demo'
    // }
    //
    // Cloning: If you need to modify the headers or create a copy of them without affecting
    // the original, wrapping them in new Headers(...) creates a new instance.
    // const headersCopy = new Headers(request.headers)
    //
    /////////////////////////
    //
    // Get headers approach 2:
    //
    const headersList = await headers()
    // Note: headersList can't be logged directly.
    //
    //   ❌
    //   console.log(`\nheaders:`)
    //   TypeError: Cannot read private member #headersList from an object whose class did not declare it
    //
    //   ✅
    //   headersList.forEach((value, key) => {  console.log(`${key}: ${value}`) })
    //
    //   ✅
    const requestHeadersObj = Object.fromEntries(headersList.entries())
    // console.log(requestHeadersObj)
    //
    ///////////////////////////////////////////////////////////////////////////

    // When you call cookies().set() in a Next.js route handler, it automatically
    // adds the Set-Cookie header to the response. The cookie store from cookies()
    // is tied to the response, so calling cookieStore.set() modifies the response headers.
    cookieStore.set('responseCookie', 'my-cookie', {
      path: '/api',
      maxAge: 3600
    })

    /* ======================
            Response
    ====================== */

    return Response.json(
      {
        code: codes.OK,
        data: {
          testSearchParam,
          testCookie: testCookie || null,
          requestHeadersObj
        },
        message: 'Success',
        success: true
      },
      {
        status: 200,
        headers: {
          // Or do:
          // const response = NextResponse.json({ ... })
          // response.headers.set('x-custom-header', 'abc123')
          // return response
          'x-custom-header': 'abc123'
          // 'Set-Cookie': 'responseCookie=abc123; Path=/api; Max-Age=3600'
        }
      }
    )
  } catch (err) {
    // if (err instanceof Error) { console.log({ name: err.name, message: err.message }) }
    return Response.json(handleError(err, 'Internal server error. (from server API route)'), { status: 500 })
  }
}
