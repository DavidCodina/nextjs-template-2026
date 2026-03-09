import { codes } from './codes'
import { ResBody } from '@/types'

// This function uses the envelope pattern to send back a standardized 500-like error.
// It's useful for server actions and server functions. However, for actual API routes,
// prefer only sending back message and/or code.
export const handleError = (_err: unknown, message = 'Internal server error.') => {
  const errorResponseBody: ResBody<null> = {
    code: codes.INTERNAL_SERVER_ERROR,
    data: null,
    message: message,
    success: false
  }

  return errorResponseBody
}
