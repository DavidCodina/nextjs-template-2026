'use client'

import { PropsWithChildren } from 'react'
import { AppProvider } from './AppContext'
import { NextThemeProvider } from './NextThemeProvider'
import { QueryClientProvider } from './QueryClientProvider'

/* ========================================================================
              
======================================================================== */

export const Providers = ({ children }: PropsWithChildren) => {
  return (
    <AppProvider>
      <QueryClientProvider>
        <NextThemeProvider>{children}</NextThemeProvider>
      </QueryClientProvider>
    </AppProvider>
  )
}
