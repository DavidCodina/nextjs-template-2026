'use client'

import * as React from 'react'
import * as DialogPrimitive from '@radix-ui/react-dialog'

/* ========================================================================

======================================================================== */
//# What is the conceptual difference between a Dialog and an AlertDialog?

//# The default ShadCN Dialog implementation still needs work to make it
//# more responsive!

function Dialog({ ...props }: React.ComponentProps<typeof DialogPrimitive.Root>) {
  return <DialogPrimitive.Root data-slot='dialog' {...props} />
}

export { Dialog }
