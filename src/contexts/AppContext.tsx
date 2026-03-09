'use client'

import React, { PropsWithChildren, useEffect, useTransition, useState, useCallback } from 'react'
import type { Route } from 'next'
import {
  createContext,
  useContextSelector
  // useContextScheduler
} from 'use-context-selector'

import { useRouter } from 'next/navigation'

export interface AppContextValue {
  test: string
  routePending: boolean
  handleRouteChange: (route: string) => void
  // [key: string]: any
}

/* ========================================================================

======================================================================== */
///////////////////////////////////////////////////////////////////////////
//
// This is a cool pattern, but you can't implement usePathname in AppProvider
// because it will wreck your cacheComponent logig, forcing you to wrap a
// Suspense boundar arouud the consumed AppProvider, which is really bad.
// If you ever want to do this, do it in a different context lower down
// -like baked into <Page />.
//
//   const pathname = usePathname()
//   const previousPath = useRef<string | null>('')
//
//   useEffect(() => {
//     return () => {
//       previousPath.current = pathname
//       console.log('previousPath.current:', previousPath.current)
//     }
//   }, [pathname])
//
///////////////////////////////////////////////////////////////////////////

export const AppContext = createContext({} as AppContextValue)

export const AppProvider = ({ children }: PropsWithChildren) => {
  /* ======================
  Logic For CurrentPageLoader
  ====================== */

  const router = useRouter()
  const [_routePending, startRouteTransition] = useTransition()

  const [routePending, setRoutePending] = useState(false)
  // Works in conjunction with TransitionLoader component.
  const handleRouteChange = useCallback(
    (route: string) => {
      startRouteTransition(() => {
        router.push(route as Route)
      })
    },
    [router]
  )

  // Defer the routePending state for an additional 250ms. This generally
  // prevents the loading spinner flicker when the page loads immediately.
  useEffect(() => {
    let routPendingTimeout: NodeJS.Timeout

    if (_routePending === true) {
      routPendingTimeout = setTimeout(() => {
        setRoutePending(_routePending)
      }, 250)
    } else {
      setRoutePending(_routePending)
    }

    return () => {
      clearTimeout(routPendingTimeout)
    }
  }, [_routePending])

  /* ======================
          return
  ====================== */

  return (
    <AppContext.Provider
      value={{
        test: 'Testing 123...',
        routePending,
        handleRouteChange
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

///////////////////////////////////////////////////////////////////////////
//
// Usage:
//
//  ✅ const showMenu    = useAppContextSelector('showMenu')
//  ✅ const setShowMenu = useAppContextSelector('setShowMenu')
//
///////////////////////////////////////////////////////////////////////////

export const useAppContextSelector = <T extends keyof AppContextValue>(key: T) => {
  const value = useContextSelector(AppContext, (state) => state[key])
  return value
}
