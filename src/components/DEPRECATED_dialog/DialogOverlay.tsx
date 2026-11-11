'use client'

import * as React from 'react'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { cn } from '@/utils'
import { DIALOG_ZINDEX_CLASS } from '../component-constants'

const baseClasses = `
data-[state=open]:animate-in
data-[state=closed]:animate-out
data-[state=closed]:fade-out-0
data-[state=open]:fade-in-0
fixed inset-0 bg-black/50
${DIALOG_ZINDEX_CLASS}
`

/* ========================================================================

======================================================================== */

function DialogOverlay({ className, ...props }: React.ComponentProps<typeof DialogPrimitive.Overlay>) {
  return <DialogPrimitive.Overlay data-slot='dialog-overlay' className={cn(baseClasses, className)} {...props} />
}

export { DialogOverlay }
