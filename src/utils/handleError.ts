import { codes } from './codes'
import { ResBody } from '@/types'

/** A client-side utilty for returning a standardized response from within a client API function's catch block. */
export const handleError = (_err: unknown, message = 'Internal server error.') => {
  // If in development, log error info for debugging...
  // However, this is super annoying when you're actually running tests,
  // so I've commented it out for now.
  // if (import.meta.env.DEV === true) {
  //   if (err instanceof Error) {
  //     console.log({ name: err.name, message: err.message })
  //   } else {
  //     console.log(err)
  //   }
  // }

  const errorResponseBody: ResBody<null> = {
    code: codes.INTERNAL_SERVER_ERROR,
    data: null,
    message: message,
    success: false
  }

  return errorResponseBody
}
