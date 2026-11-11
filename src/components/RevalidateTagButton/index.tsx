'use client'

import { Button, ButtonProps } from '@/components'
import { revalidateTagAction } from '@/actions'
import { ResBody } from '@/types'

const immediateProfile = { expire: 0 } as const

type ImmediateProfileType = typeof immediateProfile
type ProfileType = string | ImmediateProfileType

type RevalidateTagButton = ButtonProps & {
  onRevalidated?: (result: ResBody<null>) => void
  profile?: ProfileType
  shouldLog?: boolean
  tag: string
}

/* ========================================================================

======================================================================== */
///////////////////////////////////////////////////////////////////////////
//
// Usage:
//
//   <RevalidateTagButton
//     // Client-side only
//     onRevalidated={(result) => { console.log('\nRevalidation result:', result) }}
//     tag='posts'
//     profile={{ expire: 0 }}
//     size='sm'
//   >Revalidate Posts</RevalidateTagButton>
//
///////////////////////////////////////////////////////////////////////////

export const RevalidateTagButton = ({
  children,
  onClick,
  onRevalidated,
  profile = immediateProfile,
  shouldLog = false,
  tag,
  ...otherProps
}: RevalidateTagButton) => {
  const handleRevaidate = async () => {
    const result = await revalidateTagAction(tag, profile)
    if (shouldLog) {
      console.log('\nRevalidation result:', result)
    }
    onRevalidated?.(result)
  }

  return (
    <Button
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
        onClick?.(e)
        handleRevaidate()
      }}
      {...otherProps}
    >
      {children}
    </Button>
  )
}
