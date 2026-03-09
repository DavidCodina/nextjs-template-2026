'use client'

import * as React from 'react'
import { Button } from '@/components'
import type { ButtonProps } from '@/components/Button'

type ClickCounterProps = ButtonProps & {
  initialCount?: number
  step?: number
  max?: number // button disables itself once this value is reached
}

/* ========================================================================
              
======================================================================== */
///////////////////////////////////////////////////////////////////////////
//
// The associated e2e/demos/click-counter.spect.ts expects the following in
// the /test/playwrigth page:
//
//   <section className='mb-6 flex flex-wrap justify-center gap-2'>
//     <ClickCounter variant='red' data-testid='default-counter' />
//     <ClickCounter variant='orange' data-testid='initial-counter' initialCount={10} />
//     <ClickCounter variant='yellow' data-testid='step-counter' step={5} />
//     <ClickCounter variant='green' data-testid='max-counter' max={3} />
//     <ClickCounter variant='blue' data-testid='disabled-counter' disabled />
//   </section>
//
///////////////////////////////////////////////////////////////////////////

export const ClickCounter = ({ initialCount = 0, step = 1, max = Infinity, disabled, ...props }: ClickCounterProps) => {
  const [count, setCount] = React.useState(initialCount)
  const isMaxed = count >= max

  /* ======================
          return
  ====================== */

  return (
    <Button
      {...props}
      disabled={disabled || isMaxed}
      onClick={() => {
        const next = Math.min(count + step, max)
        console.log(`ClickCounter: ${next}`) // lets tests demo page.on('console')
        setCount(next)
      }}
    >
      Count: {count}
    </Button>
  )
}
