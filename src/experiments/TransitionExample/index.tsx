'use client'

import { useTransition, useState } from 'react'
import { getData } from './actions'

/* ========================================================================

======================================================================== */
// There's a number of server action tutorials that include useTransition as
// part of demos when executing server actions from a client component.
//
// useTransition (AKA useUnbatchStateUpdates()) is a React Hook that lets you update
// the state without blocking the UI. However, in the current example, it's not necessarily
// better than managing isPending with normal useState.

export const TransitionExample = () => {
  const [isPending, startTransition] = useTransition()

  const handleGetData = async () => {
    const result = await getData()
    console.log(result)
  }

  const handleClick = () => {
    startTransition(handleGetData)
  }

  return (
    <button className='btn-green btn-sm mx-auto my-12 block min-w-[200px]' disabled={isPending} onClick={handleClick}>
      {isPending ? 'Loading...' : 'Get Data'}
    </button>
  )
}

/* ========================================================================

======================================================================== */
// Managing isPending with normal useState:

export const TransitionExample2 = () => {
  const [isPending, setIsPending] = useState(false)
  const [count, setCount] = useState(0)

  const handleClick = async () => {
    setIsPending(true)
    const result = await getData()
    setIsPending(false)
    console.log(result)
  }

  return (
    <>
      <button className='btn-green btn-sm mx-auto my-12 block min-w-[200px]' disabled={isPending} onClick={handleClick}>
        {isPending ? 'Loading...' : 'Get Data'}
      </button>

      <button className='btn-neutral btn-sm mx-auto my-12 block min-w-[200px]' onClick={() => setCount((v) => v + 1)}>
        Count: {count}
      </button>
    </>
  )
}

/* ========================================================================

======================================================================== */
// The real benefit of useTransition is when you need to interrupt a state update,
// or unbatch a state update because one state update in computationally heavy.
// However, that is really more of an edge case. Ultimately, I think the introduction
// of useTransition in discussions of server actions is somewhat misleading.
//
// There may be a more valid use case when it comes to optimistic updates.
// So far, the only argument I've seen in favor of useTransition is that it
// simplifies the state management (i.e., you get isPending out of the box).

export const TransitionExample3 = () => {
  const [_, startTransition] = useTransition()
  const [isPending, setIsPending] = useState(false)
  const [count, setCount] = useState(0)

  const handleGetData = async () => {
    setIsPending(true)
    const result = await getData()
    console.log(result)
    setIsPending(false)
  }

  const handleClick = () => {
    // High priority
    handleGetData()

    // Low priority
    startTransition(() => {
      setCount(() => {
        let newCount = 0
        for (let i = 0; i < 1000000000; i++) {
          newCount = i
        }
        return newCount
      })
    })
  }

  return (
    <>
      <button className='btn-green btn-sm mx-auto my-12 block min-w-[200px]' disabled={isPending} onClick={handleClick}>
        {isPending ? 'Loading...' : 'Get Data'}
      </button>

      <button className='btn-neutral btn-sm mx-auto my-12 block min-w-[200px]' onClick={() => setCount((v) => v + 1)}>
        Count: {count}
      </button>
    </>
  )
}
