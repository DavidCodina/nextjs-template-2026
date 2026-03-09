import { auth } from '@/lib/auth'
import { toNextJsHandler } from 'better-auth/next-js'

/* ========================================================================

======================================================================== */
// https://www.better-auth.com/docs/integrations/next#create-api-route

export const { GET, POST } = toNextJsHandler(auth)
