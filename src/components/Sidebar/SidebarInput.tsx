'use client'

import * as React from 'react'
import { cn } from '@/utils'
import { Input } from '@/components'

/* ========================================================================

======================================================================== */

function SidebarInput(props: React.ComponentProps<typeof Input>) {
  const { inputProps, ...otherProps } = props
  return (
    <Input
      {...otherProps}
      inputProps={{
        ...inputProps,
        'data-slot': 'sidebar-input',
        'data-sidebar': 'input',
        className: cn('bg-background h-8 w-full shadow-none', inputProps?.className)
      }}
    />
  )
}

export { SidebarInput }
