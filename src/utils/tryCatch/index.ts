///////////////////////////////////////////////////////////////////////////
//
// Based off of Theo's youtube and gist:
//
//   https://www.youtube.com/watch?v=Y6jT-IkV0VM
//   https://gist.github.com/t3dotgg/a486c4ae66d32bf17c09c73609dacc5b
//
// However, in his demo tryCatch is the async version and there is no sync version.
// For a more full-featured solution, see neverthrow or effect.ts
//
// Safe Assignment Operator Proposal:
//
//   https://www.youtube.com/watch?v=lng6dmrWg8A&t=12s
//   https://www.youtube.com/watch?v=qSbzX5KtCSQ
//
///////////////////////////////////////////////////////////////////////////

// Types for the result object with discriminated union
type Success<T> = {
  data: T
  error: null
}

type Failure<E> = {
  data: null
  error: E
}

type Result<T, E = Error> = Success<T> | Failure<E>

/* ======================
      tryCatchSync()
====================== */

export function tryCatchSync<T, E = Error>(fn: () => T): Result<T, E> {
  try {
    const data = fn()
    return { data, error: null }
  } catch (error) {
    return { data: null, error: error as E }
  }
}

/* ======================
    tryCatchAsync()
====================== */

export async function tryCatchAsync<T, E = Error>(promise: Promise<T>): Promise<Result<T, E>> {
  try {
    const data = await promise
    return { data, error: null }
  } catch (error) {
    return { data: null, error: error as E }
  }
}
