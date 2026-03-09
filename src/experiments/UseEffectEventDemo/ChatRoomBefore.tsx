'use client'

import * as React from 'react'
import { toast } from 'sonner'
import { createConnection } from './createConnection'

/* ========================================================================

======================================================================== */
///////////////////////////////////////////////////////////////////////////
//
// The problem here is that we've coupled the connection with the theme.
// When we connect, we want to be able to pass the theme to the toast that
// indicates that the user is connected. However, now if the theme changes,
// it will cause the connection to disconnect and reconnect.
//
//   Solution 1: We can remove theme from the dependency array, but then we get this warning:
//   ⚠️ React Hook React.useEffect has a missing dependency: 'theme'. Either include it or remove the dependency array.
//   Then we would hack it with something like: eslint-disable-line.
//
//   Solution 2: Use const themeRef = React.useRef(theme) to bypass the usEffect dependency array.
//
//   Solution 3: Implement the new useEffectEvent() hook.
//
// With all of that said, there was a time when useEffect's linting simply didn't complain
// when you omitted dependencies. Admittedly, this would cause a stale closure, but as long as
// you knew what you were doing, it wasn't a big deal.
//
// So.. Why Not Just Relax the Linting? React's philosophy is: "Make the right thing easy, and the wrong thing hard".
// If they relaxed linting, they'd be telling developers: "Sure, go ahead and read stale values! Good luck debugging that later!"
// In other words, if the linting was relaxed, omitting theme from the deps in this case would be a perfectly fine solution.
// However, it's also probable that some developer would come along later and implement a useEffect somewhere else and
// create a bug by forgetting to add something crucial to the deps.
//
// The "Expert vs. Footgun" Problem: React is making a framework-level decision: "Do we optimize for experts who know what
// they're doing, or prevent footguns for the majority?" React's stance is essentially:"We can't distinguish between
// 'developer who knows what they're doing' and 'developer who will create a bug'. So we make the safe path the default."
//
///////////////////////////////////////////////////////////////////////////

export const ChatRoomBefore = ({ roomId, theme }: { roomId: string; theme?: string }) => {
  const [mounted, setMounted] = React.useState(false)
  // const themeRef = React.useRef(theme)

  /* ======================
          useEffect()
  ====================== */
  // Note: This will happen twice on mount in dev mode because of react stricct mode.

  React.useEffect(() => {
    const conn = createConnection(roomId)
    conn.on('connected', () => {
      toast.success(`Connected to Chat Room!${theme ? ` Theme: ${theme}` : ''}`)
      // toast.success(`Connected to Chat Room!${themeRef.current ? ` Theme: ${themeRef.current}` : ''}`)
    })

    return () => conn.disconnect()
  }, [roomId, theme])

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
