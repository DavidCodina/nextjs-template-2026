import { StateCreator } from 'zustand'

export interface CountSlice {
  count: number
  setCount: (value: number) => void
  resetCount: () => void
}

/* ========================================================================

======================================================================== */

export const createCountSlice: StateCreator<CountSlice> = (set, _get, _store) => {
  return {
    count: 0,
    setCount: (value) =>
      // The first arg passed to set() can be either the full or partial slice object,
      // or a callback fucntion that returns the full or partial slice object.
      // The second arg passed to set() is the options replace boolean flag.
      //
      // Zustand uses state merging by default. This means that if you simply
      // return { count: value }, that will then merge with other state in the slice.
      // In other words, no need to do this: { ...state, count: value }
      set((_state) => {
        return { count: value }
      }),
    resetCount: () => set({ count: 0 })
  }
}
