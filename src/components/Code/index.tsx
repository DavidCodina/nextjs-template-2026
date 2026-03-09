'use client'
import * as React from 'react'
import { cn } from '@/utils'
type CodeProps = React.ComponentProps<'code'>

/* ========================================================================

======================================================================== */
// This component is very simple, but it's important to componentize and
// abstract  <code>, rather than writing <code className='text-pink-500'>...</code>
// everywhere. This way the Code component exists as the single source of truth, and
// we can make updates globally from here.

export const Code = ({ children, className = '', ...otherProps }: CodeProps) => {
  /* ======================
          return
  ====================== */

  return (
    <code
      {...otherProps}
      ///////////////////////////////////////////////////////////////////////////
      //
      //  word-break: break-all (break-all) vs. overflow-wrap: break-word (wrap-break-word)
      //
      // overflow-wrap: break-word
      //   - Only breaks words when necessary to prevent overflow
      //   - Tries to keep words intact and only breaks at natural break points
      //   - More conservative approach that preserves readability
      //   - Will break long words like supercalifragilisticexpialidocious only if they would overflow
      //
      // word-break: break-all
      //   - Breaks words at any character to prevent overflow
      //   - More aggressive - will break even short words if needed
      //   - Can create awkward breaks like supe|rcali|fragi|listi|cexp|iali|docio|us
      //   - Less readable but more predictable behavior.
      //
      // It turns out that word-break: break-all is actually too aggressive.
      // For example, if you have a '600px', it will break it at:
      //
      //                                                                       6
      // 00px
      //
      ///////////////////////////////////////////////////////////////////////////
      className={cn('overflow-wrap text-pink-500', className)}
      data-slot='code'
    >
      {children}
    </code>
  )
}
