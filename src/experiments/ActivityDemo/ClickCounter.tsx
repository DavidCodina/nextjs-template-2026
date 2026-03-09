'use client'

import * as React from 'react'
import { Button } from '@/components'

/* ========================================================================

======================================================================== */

export const ClickCounter = () => {
  const [count, setCount] = React.useState(0)

  React.useEffect(() => {
    ///////////////////////////////////////////////////////////////////////////
    //
    // This is using AbortController as a more modern alternative to the traditional removeEventListener pattern.
    // When you pass { signal: controller.signal } to addEventListener, you're linking that listener to the AbortController.
    // When you call controller.abort() in the cleanup function, it automatically removes any event listeners that were registered with that signal.
    // The traditional approach requires you to keep a reference to the handler function.
    // With AbortController, you can use inline/anonymous functions without needing to store a reference.
    // See WDS: https://www.youtube.com/watch?v=BeZfiCPhZbI
    //
    ///////////////////////////////////////////////////////////////////////////
    const controller = new AbortController()
    document.addEventListener('click', () => console.log('Clicked!'), {
      signal: controller.signal
    })

    return () => {
      console.log('Clean up function called.')
      controller.abort()
    }
  }, [])

  return (
    <>
      <Button
        className='min-w-[200px]'
        onClick={() => {
          setCount((v) => v + 1)
        }}
        size='sm'
      >
        Count: {count}
      </Button>

      <input className='bg-card block min-w-[200px] rounded border px-2 py-1 text-sm' placeholder='Type something...' />
    </>
  )
}
