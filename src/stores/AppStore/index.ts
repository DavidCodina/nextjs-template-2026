import { create } from 'zustand'
import { devtools /* , persist */ } from 'zustand/middleware'
import { createCountSlice, CountSlice } from './countSlice'

type AppStore = CountSlice

/* ========================================================================

======================================================================== */

export const useAppStore = create<AppStore>()(
  devtools(
    (...args) => {
      return {
        ...createCountSlice(...args)
      }
    }
    // { name: 'AppStore' }
  )
)
