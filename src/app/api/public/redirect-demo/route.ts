import { redirect } from 'next/navigation'

/* ========================== ==============================================

======================================================================== */
// The redirect() function sends a 3xx status code telling the browser to make a new request

export async function GET(_req: Request) {
  redirect('https://jsonplaceholder.typicode.com/todos?_limit=5')
}

///////////////////////////////////////////////////////////////////////////
//
// ⚠️ Gotcha: You can't use rewrite() in a route handler. It would be cool if you
// could do this:
//
//   export async function GET(_req: Request) {
//     return NextResponse.rewrite('https://jsonplaceholder.typicode.com/todos?_limit=5')
//   }
//
// But it results in the following:
//   ❌ [Error: NextResponse.rewrite() was used in a app route handler, this is not currently supported. Please remove the invocation to continue.]
//
//
// If you want to rewrite a route, then you can only do it from within middlware.ts as follows:
//
//   if (nextUrl.pathname === '/api/public/get-todos') {
//     return NextResponse.rewrite('https://jsonplaceholder.typicode.com/todos?_limit=5')
//   }
//
// Alternatively, you can fetch() and proxy in the route handler
//
///////////////////////////////////////////////////////////////////////////

// export async function GET(_req: Request) {
//   // This is a proxy demo.
//   const response = await fetch(
//     'https://jsonplaceholder.typicode.com/todos?_limit=5'
//   )
//   const data = await response.json()
//   return Response.json(data)
// }
