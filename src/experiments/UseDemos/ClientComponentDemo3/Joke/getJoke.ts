import { randomFail } from '@/utils'
import { ResponsePromise } from '@/types'

type Data = { value: string }
export type GetJokeResponsePromise = ResponsePromise<Data>
export type GetJoke = (url: string) => GetJokeResponsePromise
export type GetJokeResolvedResponse = Awaited<GetJokeResponsePromise>

/* ========================================================================

======================================================================== */
///////////////////////////////////////////////////////////////////////////
//
// In this case, we're not catching the error internally. Instead, if an
// error occurs, we're simply allowing it to bubble up to
// the ErrorBoundary. As mentioned in the other examples, this is not
// normally what I would do. It's better to catch the error here, and
// handle a success:false case in the associated component
// (i.e., don't rely on an ErrorBoundary to handle the error).
//
// ⚠️ Next.js Attempts To Adapt To SSR Failures
//
// In theory, the error will bubble up to the ErrorBoundary.
// However, Next.js also executes client components on the server.
// If it detects an error during the initial server-side execution,
// it will do this:
//
//   ❌ Uncaught Error: Switched to client rendering because the server rendering errored.
//
// From what I can tell, this is not necessarily a bad thing, but it does result in unintuitive outcomes.
// In the case of a error being thrown during the server execution, the browser console will log the error,
// but unless the client side render also triggered the randomFail(0.25), you will actually see a joke.
//
// The key takeaway is that Next.js adapts dynamically when SSR fails —it doesn’t necessarily
// indicate a bug in your code, just a recovery mechanism to ensure the UI remains functional.
//
// This is yet another reason to preemptively catch the error in the getJoke() function.
// It's just a better practice overall and less confusing.
//
///////////////////////////////////////////////////////////////////////////

export const getJoke: GetJoke = async (url: string) => {
  if (randomFail(0.25)) {
    throw new Error('Whoops! Something went wrong!')
  }

  const res = await fetch(url)
  // const res = await fetch('https://httpstat.us/400')

  const json = await res.json()
  return {
    data: json as Data,
    message: 'Success',
    success: true
  }
}
