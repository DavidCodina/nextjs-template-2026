'use client'

import { useState, useRef, useEffect, ReactNode, RefObject } from 'react'
import { motion, useInView } from 'framer-motion'

type Props = {
  children: ReactNode
  delay?: number
  duration?: number
  y?: number
}

/* ========================================================================

======================================================================== */
// Sam Selikoff: https://www.youtube.com/watch?v=GIIuG5_kyow

export function FadeUp({ children, delay = 0, duration = 0.5, y = 15 }: Props) {
  const ref = useRef<HTMLDivElement | null>(null)
  const isInView = useInView(ref as RefObject<HTMLDivElement>)
  const [isVisible, setIsVisible] = useState(false)

  /* ======================
        useEffect()
  ====================== */

  useEffect(() => {
    if (isInView && !isVisible) {
      setIsVisible(true)
    }
  }, [isInView, isVisible])

  /* ======================
          return
  ====================== */

  return (
    <motion.div
      ref={ref}
      variants={{
        hidden: {
          opacity: 0,
          y: y
        },
        visible: {
          opacity: 1,
          y: 0
        }
      }}
      initial='hidden'
      animate={isVisible ? 'visible' : 'hidden'}
      transition={{ delay, type: 'spring', duration }}
    >
      {children}
    </motion.div>
  )
}
