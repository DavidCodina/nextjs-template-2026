'use client'

import { PropsWithChildren } from 'react'
import { MantineThemeProvider } from './MantineThemeProvider'

import { AppProvider } from './AppContext'
import { NextThemeProvider } from './NextThemeProvider'
import { QueryClientProvider } from './QueryClientProvider'

/* ========================================================================
              
======================================================================== */

export const Providers = ({ children }: PropsWithChildren) => {
  return (
    <AppProvider>
      <QueryClientProvider>
        <NextThemeProvider>
          <MantineThemeProvider>{children}</MantineThemeProvider>
        </NextThemeProvider>
      </QueryClientProvider>
    </AppProvider>
  )
}
