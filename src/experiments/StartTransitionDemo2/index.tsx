'use client'

import { useTransition, useState } from 'react'
import { sleep } from 'utils'

/* ========================================================================

======================================================================== */

const CounterCard = ({ isPending, count, handleClick }: any) => {
  const renderUser = () => {
    return (
      <div
        className={`mx-auto flex h-[200px] rounded-lg border border-neutral-400 bg-white p-4 text-sm shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px]`}
      >
        {isPending ? (
          <div className='flex-1 self-center text-center text-3xl font-black text-blue-500'>Processing...</div>
        ) : (
          <div className='flex-1 self-center text-center text-6xl font-black text-blue-500'>{count}</div>
        )}
      </div>
    )
  }

  const renderIncrementButton = () => {
    return (
      <button
        className='absolute bottom-0 left-0 w-full rounded-b border border-blue-700 bg-blue-500 px-2 py-1 text-sm font-bold text-white'
        onClick={() => {
          handleClick()
        }}
        style={{ minWidth: 150 }}
      >
        Increment
      </button>
    )
  }

  return (
    <section className='relative w-[300px]'>
      {renderUser()}
      {renderIncrementButton()}
    </section>
  )
}

/* ========================================================================

======================================================================== */

const BadCounter = () => {
  const [count, setCount] = useState(0)
  const [isPending, setIsPending] = useState(false)

  const increment = async () => {
    setIsPending(true)
    await sleep(1000)
    setCount((v) => v + 1)
    setIsPending(false)
  }

  const handleClick = () => {
    increment()
  }

  return (
    <>
      <CounterCard isPending={isPending} count={count} handleClick={handleClick} title='Bad Version' />
    </>
  )
}

/* ========================================================================

======================================================================== */

const GoodCounter = () => {
  const [count, setCount] = useState(0)

  const [isPending, startTransition] = useTransition()

  const increment = async () => {
    await sleep(1000)
    setCount((v) => v + 1)
  }

  const handleClick = () => {
    startTransition(increment)
  }

  return (
    <>
      <CounterCard isPending={isPending} count={count} handleClick={handleClick} title='Good Version' />
    </>
  )
}

/* ========================================================================

======================================================================== */

export const StartTransitionDemo2 = () => {
  return (
    <>
      <div className='my-12 flex justify-center gap-6'>
        <GoodCounter />
        <BadCounter />
      </div>
    </>
  )
}
