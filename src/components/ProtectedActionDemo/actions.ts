'use server'

//! import { auth } from '@/auth'

type ProtectedActionData = {
  data: any
  message: string
  success: boolean
}

/* ========================================================================

======================================================================== */
//# This needs updating to Better Auth.
//# See Coding in FLow: at 50:30 : https://www.youtube.com/watch?v=w5Emwt3nuV0

export const protectedAction = async (): Promise<ProtectedActionData> => {
  //! const session = await auth()

  //! if (!session) {
  //!   return {
  //!     data: null,
  //!     message: 'Unauthorized. User must be authenticated.',
  //!     success: false
  //!   }
  //! }

  return {
    data: { id: 'abc123', message: "You've accessed the protected action!" },
    message: 'Success.',
    success: true
  }
}
