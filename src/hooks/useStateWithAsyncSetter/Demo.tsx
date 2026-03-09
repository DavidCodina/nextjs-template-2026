'use client'

import * as React from 'react'
import { useStateWithAsyncSetter } from './'

/* ========================================================================

======================================================================== */

export const Demo = () => {
  const [count, setCount] = useStateWithAsyncSetter(0)
  const [details, setDetails] = React.useState(`Count is now: ${count}`)

  ///////////////////////////////////////////////////////////////////////////
  //
  // ⚠️ The real argument against implementing useStateWithAsyncSetter is not that
  // it's unidiomatic/imperative, but that handleIncement could've just done this:
  //
  //   const handleIncrement = async () => {
  //     const newValue = count + 1
  //     setCount(newValue)
  //     setDetails(`Count is now: ${newValue}`)
  //   }
  //
  ///////////////////////////////////////////////////////////////////////////

  const handleIncrement = async () => {
    // try/catch not needed because useStateWithAsyncSetter never rejects or throws.
    const newValue = await setCount((v) => v + 1)
    setDetails(`Count is now: ${newValue}`)
  }

  // const handleIncrement = () => setCount((v) => v + 1)
  //   .then((newValue) => {
  //     setDetails(`Count is now: ${newValue}`)
  //     return newValue
  //   })
  //   .catch((err) => err)

  return (
    <div className='mx-auto max-w-md rounded-xl border border-blue-500 bg-white p-4 shadow'>
      <button
        className='mx-auto mb-2 block min-w-[150px] rounded bg-blue-500 px-2 py-1 font-bold text-white'
        onClick={handleIncrement}
      >
        Count: {count}
      </button>

      <div className='text-center text-xl font-bold text-blue-500'>{details}</div>
    </div>
  )
}
