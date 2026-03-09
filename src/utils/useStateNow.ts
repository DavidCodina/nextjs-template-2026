import * as React from 'react'

/* ========================================================================

======================================================================== */
///////////////////////////////////////////////////////////////////////////
//
// Usage:
//
// This hook allows you to immediately access the new value.
//
//   <button
//     className='cursor-pointer rounded-lg bg-blue-500 px-2 py-1 text-white'
//     onClick={() => {
//       const nowValue = setValue((v) => v + 1)
//       console.log({ value, nowValue })
//     }}
//     type='button'
//   >Count: {value}</button>
//
// This hook is more of an experiment. 99% of the time, you probably don't want
// to use this hook because it's just easier to calculate the newValue prior to
// passing it into the the state setter.
//
// onClick={() => {
//   const nextValue = value + 1;
//   setValue(nextValue);
//   console.log(nextValue);
// }}
//
//
///////////////////////////////////////////////////////////////////////////

export function useStateNow<T>(initialValue: T) {
  const [state, _setState] = React.useState<T>(initialValue)
  const stateRef = React.useRef<T>(initialValue)

  // Why useLayoutEffect? Ref can be stale for one
  // frame when state is updated externally.
  React.useLayoutEffect(() => {
    stateRef.current = state
  })

  const setState = (param: React.SetStateAction<T>): T => {
    const nextValue = typeof param === 'function' ? (param as (prev: T) => T)(stateRef.current) : param

    stateRef.current = nextValue

    _setState(nextValue)

    return stateRef.current
  }

  return [state, setState] as const
}
