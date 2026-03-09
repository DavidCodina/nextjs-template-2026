'use client'

import * as React from 'react'
import { toast } from 'sonner'
import { createConnection } from './createConnection'

/* ========================================================================

======================================================================== */

export const ChatRoomAfter = ({ roomId, theme }: { roomId: string; theme?: string }) => {
  const [mounted, setMounted] = React.useState(false)
  /* ======================
      useEffectEvent()
  ====================== */

  // If need be, you can pass one or more args to the useEffectEvent callback.
  // However, in most cases that shouldn't be necessary since the useEffectEvent
  // callback has dynamic access to the component function's scope. In other words,
  // it's not at all like useState's lazy initialization.
  const onConnected = React.useEffectEvent(() => {
    toast.success(`Connected to chat room with id of ${roomId}.${theme ? ` Theme: ${theme}` : ''}`)
  })

  /* ======================
          useEffect()
  ====================== */
  // Note: This will happen twice on mount in dev mode because of react stricct mode.

  React.useEffect(() => {
    const conn = createConnection(roomId)
    conn.on('connected', onConnected)

    return () => conn.disconnect()
  }, [roomId])

  /* ======================
        useEffect()
  ====================== */
  // Don't render the JSX until the component is mounted.
  // This prevents a Next.js hydration mismatch error whereby
  // the JSX on the server executed version differs from the
  // JSX on the client rendered version.

  React.useEffect(() => {
    setMounted(true)
  }, [])

  /* ======================
          return
  ====================== */

  if (!mounted) {
    return null
  }

  return (
    <div className='bg-card text-primary border-primary mx-auto my-6 w-fit rounded-lg border px-4 py-2 shadow'>
      Theme: {theme}
    </div>
  )
}
