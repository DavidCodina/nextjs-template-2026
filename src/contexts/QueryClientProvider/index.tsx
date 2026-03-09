'use client'

import type { ReactNode } from 'react'
import { QueryClientProvider as ReactQueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { getQueryClient } from '@/utils'

/* ========================================================================

======================================================================== */

export const QueryClientProvider = ({ children }: Readonly<{ children: ReactNode }>) => {
  // Do NOT use useState here. If React suspends during the first render
  // it would throw the client away. The factory already handles reuse.
  const queryClient = getQueryClient()

  return (
    <ReactQueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </ReactQueryClientProvider>
  )
}
