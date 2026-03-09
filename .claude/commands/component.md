---
description: 'Create a React functional component with TypeScript'
---

## Overview

Create a React functional component using arrow function syntax.
This should be inside of an index.tsx file, inside of a directory name that matches the component name.
The component name should default to NewComponent if not specified in the prompt.

Unless otherwise specified, the component folder should be placed in the same directory
as the file that currently represents the active tab in the IDE (i.e., the file that has context).
In other words, do not automatically put the component in the src/components directory.

The component should always use named export syntax.

The component should have the following basic structure unless otherwise specified.

Always use: import { cn } from '@/utils'
Never use: import { cn } from '@/lib/utils'

```
'use client'
import * as React from 'react'
import { cn } from '@/utils'

type Props = React.ComponentProps<'div'>

/* ========================================================================

======================================================================== */

export const NewComponent = ({
  children,
  className = '',
  ref,
  style = {},
  ...otherProps
}: Props) => {
  // const [value, setValue] = React.useState('')
  const internalRef = React.useRef<HTMLDivElement>(null)

  /* ======================
        useEffect()
  ====================== */

  React.useEffect(() => {
    if (!internalRef.current) {
      return
    }
    console.log('internalRef.current:', internalRef.current)
    // return () => {}
  }, [])

  /* ======================
          return
  ====================== */

  return (
    <div
      {...otherProps}
      ref={(node) => {
        if (ref && 'current' in ref) {
          ref.current = node
        } else if (typeof ref === 'function') {
          ref?.(node)
        }
        internalRef.current = node
      }}
      className={cn('bg-card rounded-lg border p-4', className)}
      style={style}
      // data-slot='YOUR_SLOT_NAME'
    >
      {children}
    </div>
  )
}

```

Do not import or add the component to any other files. Just create it. That's it.
