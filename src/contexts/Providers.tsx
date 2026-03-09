'use client'

import { PropsWithChildren } from 'react'
import { AppProvider } from './AppContext'
import { NextThemeProvider } from './NextThemeProvider'

/* ========================================================================
              
======================================================================== */

export const Providers = ({ children }: PropsWithChildren) => {
  return (
    <AppProvider>
      {/* <AuthProvider> */}
      <NextThemeProvider>{children}</NextThemeProvider>
      {/* </AuthProvider> */}
    </AppProvider>
  )
}
