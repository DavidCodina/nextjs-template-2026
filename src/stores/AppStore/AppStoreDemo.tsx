'use client'

import { useAppStore } from '@/stores'
import { Button } from '@/components'

/* ========================================================================
                              ClickCounter
======================================================================== */

export const ClickCounter = () => {
  const count = useAppStore((state) => state.count)
  const setCount = useAppStore((state) => state.setCount)

  /* ======================
          return
  ====================== */

  return (
    <Button
      className='mx-auto mb-6 block'
      onClick={() => {
        const newCount = count + 1

        setCount(newCount)
      }}
    >
      count: {count}
    </Button>
  )
}
