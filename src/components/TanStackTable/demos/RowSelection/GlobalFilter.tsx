import { DebouncedInput } from './DebouncedInput'

import type { GlobalFilterProps } from './types'

import { cn } from '@/utils'

const FIELD_BOX_SHADOW_MIXIN = `shadow-xs`

const FIELD_FOCUS_MIXIN = `
focus-visible:shadow-none
focus-visible:border-(--table-border-color)
focus-visible:ring-[3px]
focus-visible:ring-(--table-border-color)/40
`

const FIELD_DISABLED_MIXIN = `
disabled:pointer-events-none
disabled:border-(--table-disabled-color)
disabled:placeholder:text-(--table-disabled-color)
disabled:opacity-65
`

// Use flex-1 and not w-full
const baseClasses = `
flex flex-1 bg-card
min-w-0
px-[0.5em] py-[0.25em]
text-base leading-[1.5] font-normal
rounded-[0.375em]
border border-(--table-border-color) outline-none
placeholder:text-muted-foreground
${FIELD_BOX_SHADOW_MIXIN}
${FIELD_FOCUS_MIXIN}
${FIELD_DISABLED_MIXIN}
`

/* ========================================================================
                              GlobalFilter                  
======================================================================== */

export const GlobalFilter = ({
  className = '',
  enableGlobalFilter,
  globalFilter = '',
  setGlobalFilter,
  placeholder = 'Search all columns...',
  ...otherProps
}: GlobalFilterProps) => {
  ///////////////////////////////////////////////////////////////////////////
  //
  // Unlike in ColumnFilter, GlobalFilter's handleChange doesn't seem to need to
  // be wrapped in a useCallback:
  //
  //   const handleChange = useCallback(
  //     (value) => { setGlobalFilter(String(value)) }, [setGlobalFilter]
  //   )
  //
  // Why? Presumably, because setGlobalFilter is a state setter, and won't
  // trigger a rerender whereas in ColumnFilter column.setFilterValue(value)
  // is used...
  //
  ///////////////////////////////////////////////////////////////////////////

  const handleChange = (value: any) => {
    setGlobalFilter(String(value))
  }

  /* ======================
          return
  ====================== */

  if (enableGlobalFilter !== true) return null

  return (
    <DebouncedInput
      {...otherProps} // e.g., disabled, etc.
      className={cn(baseClasses, className)}
      onChange={handleChange}
      placeholder={placeholder}
      value={globalFilter}
    />
  )
}
