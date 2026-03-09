'use client'

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
//     // Client-side only
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
  const handleUpdate = async () => {
    const result = await updateTagAction(tag)
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
        onClick?.(e)
        handleUpdate()
      }}
      {...otherProps}
    >
      {children}
    </Button>
  )
}
