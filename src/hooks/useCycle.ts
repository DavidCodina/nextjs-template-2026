// Third-party imports
import { useCallback, useState } from 'react'

/* ======================
      useCycle()
====================== */
// This is the same as the one exported from 'framer-motion'.

const wrap = (min: number, max: number, v: number) => {
  const rangeSize = max - min
  return ((((v - min) % rangeSize) + rangeSize) % rangeSize) + min
}

export function useCycle<T>(...items: T[]) {
  const [index, setIndex] = useState(0)

  const runCycle = useCallback(
    (next?: number) => {
      setIndex((current) => (typeof next !== 'number' ? wrap(0, items.length, current + 1) : next))
    },
    [items.length]
  )

  return [items[index], runCycle] as const
}
