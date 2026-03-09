'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'

/* ========================================================================

======================================================================== */
// Possible unverified gotcha: By design it doesn't change on search-param-only navigations.

export const NoPreserve = ({ children }: { children: React.ReactNode }) => {
  const { bfcacheId } = useRouter()

  return <React.Fragment key={bfcacheId}>{children}</React.Fragment>
}
