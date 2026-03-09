'use client'

import { useState, useMemo } from 'react'
import { Data } from './Data'
import { getData } from './getData'

/* ========================================================================

======================================================================== */
// This uses a lot of the same ideas from the original ClientComponentDemo,
// but without all the extra logic and comments.

export const ClientComponentDemo2 = () => {
  const [fetchCount, setFetchCount] = useState(1)

  const fetchPromise = useMemo(
    () => getData(),
    // eslint-disable-next-line
    [fetchCount]
  )

  /* ======================
         return
  ====================== */

  return (
    <Data
      onRetry={() => {
        setFetchCount((v) => v + 1)
      }}
      promise={fetchPromise}
      shouldFetch={fetchCount > 0}
    />
  )
}
