import { useEffect, useEffectEvent, useState } from 'react'

import type { DebouncedInpuProps } from './types'

/* ========================================================================
                              DebouncedInput              
======================================================================== */
// Imported into both GlobalFilter and ColumnFilter.

export const DebouncedInput = ({
  debounce = 500,
  onChange,
  value: initialValue,
  ...otherProps
}: DebouncedInpuProps) => {
  const [value, setValue] = useState(initialValue)

  /* ======================
        useEffect()
  ====================== */

  useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  /* ======================
        useEffect()
  ====================== */
  ///////////////////////////////////////////////////////////////////////////
  //
  // ⚠️ Gotcha! Initially I was just implementing a useEffect as follows:
  //
  //   useEffect(() => {
  //     const timeout = setTimeout(() => {
  //       if (typeof onChange === 'function') { onChange(value) }
  //     }, debounce)
  //     return () => clearTimeout(timeout)
  //   }, [debounce, onChange, value])
  //
  //
  // The onChange was causing infinite rerenders.
  // The demo example only includes [value] in the dependency array.
  // https://codesandbox.io/s/github/tanstack/table/tree/main/examples/react/filters?from-embed=&file=/src/main.tsx:11571-11580
  // onChange no longer causes infinite rerenders in this implementation because ColumnFilter wraps it in useCallback.
  //
  // For some reason, GlobalFilter didn't have this issue (even without useCallback).
  // Why? Presumably, because setGlobalFilter is a state setter, and won't
  // trigger a rerender whereas in ColumnFilter column.setFilterValue(value)
  // is used... We could wrapped the associated handleChange function in GlobalFilter
  // in useCallback, but it just doesn't seem to need it.
  //
  // In any case, a more modern implementation can get around this entirely with useEffectEvent.
  //
  ///////////////////////////////////////////////////////////////////////////

  // Always sees the latest `onChange`, but never forces this effect to re-run.
  const emitChange = useEffectEvent((v: typeof initialValue) => {
    if (typeof onChange === 'function') {
      onChange(v)
    }
  })

  useEffect(() => {
    const timeout = setTimeout(() => emitChange(value), debounce)
    return () => clearTimeout(timeout)
  }, [value, debounce])

  /* ======================
          return
  ====================== */

  return <input spellCheck={false} {...otherProps} onChange={(e) => setValue(e.target.value)} value={value} />
}
