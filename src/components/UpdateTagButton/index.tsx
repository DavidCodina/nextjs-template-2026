'use client'

import { useState } from 'react'
import { Button, ButtonProps } from '@/components'
import { updateTagAction } from '@/actions'
import { ResBody } from '@/types'

type UpdateTagButton = ButtonProps & {
  onUpdated?: (result: ResBody<null>) => void
  shouldLog?: boolean
  tag: string
}

/* ========================================================================

======================================================================== */
///////////////////////////////////////////////////////////////////////////
//
// Usage:
//
//   <UpdateTagButton
//     //⚠️ Client-side only
//     // onUpdated={(result) => { console.log('\nUpdate result:', result) }}
//     shouldLog={true}
//     tag='posts'
//     size='sm'
//   >Update Posts</UpdateTagButton>
//
///////////////////////////////////////////////////////////////////////////

export const UpdateTagButton = ({
  children,
  onClick,
  onUpdated,
  shouldLog = false,
  tag,
  ...otherProps
}: UpdateTagButton) => {
  const [updating, setUpdating] = useState(false)

  const handleUpdate = async () => {
    setUpdating(true)
    const result = await updateTagAction(tag)
    setUpdating(false)
    if (shouldLog) {
      console.log('\nUpdate result:', result)
    }
    onUpdated?.(result)
  }

  return (
    <Button
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
        // e.nativeEvent.stopImmediatePropagation() // native-level
        onClick?.(e)
        handleUpdate()
      }}
      loading={updating}
      {...otherProps}
    >
      {children}
    </Button>
  )
}
