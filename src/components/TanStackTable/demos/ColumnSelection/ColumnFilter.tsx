import { useCallback } from 'react'
import { DebouncedInput } from './DebouncedInput'

import type { ColumnFilterProps } from './types'

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
`

// 'text-xs leading-[1.5] file:text-xs file:leading-[1.5]'
const baseClasses = `
flex bg-card
w-full min-w-0
my-1 px-[0.5em] py-[0.25em]
text-xs leading-[1.5] font-normal
rounded-[0.375em]
border border-(--table-border-color) outline-none
placeholder:text-muted-foreground
${FIELD_BOX_SHADOW_MIXIN}
${FIELD_FOCUS_MIXIN}
${FIELD_DISABLED_MIXIN}
`

/* ========================================================================
                                ColumnFilter                
======================================================================== */

export const ColumnFilter = ({ className = '', column, style = {}, ...otherProps }: ColumnFilterProps) => {
  const columnFilterValue: any = column.getFilterValue()

  const handleChange = useCallback((value: string | number) => column.setFilterValue(value), [column])

  /* ======================
          return
  ====================== */

  return (
    <DebouncedInput
      {...otherProps} // e.g., disabled, etc.
      placeholder='Search...'
      className={cn(baseClasses, className)}
      ///////////////////////////////////////////////////////////////////////////
      //
      // Gotcha: this will cause infinite rerenders when the onChange function
      // is passed into the useEffect within the DebouncedInput component.
      //
      //   onChange={(value) => column.setFilterValue(value)}
      //
      // The official example actually omits onChange from the dependency array:
      // https://codesandbox.io/s/github/tanstack/table/tree/main/examples/react/filters?from-embed=&file=/src/main.tsx:11571-11580
      //
      //   useEffect(() => { ... }, [value])
      //
      // But that's not really a great practice.
      // A better approach is to wrap it in useCallback
      //
      ///////////////////////////////////////////////////////////////////////////
      onChange={handleChange}
      style={style}
      value={columnFilterValue ?? ''}
    />
  )
}
