'use client'

import * as React from 'react'
import { cn } from '@/utils'

type PProps = React.ComponentProps<'p'>

/* ========================================================================

======================================================================== */

export const P = ({ children, className = '', ...otherProps }: PProps) => {
  return (
    <p
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

      className={cn('mb-[1.5em] wrap-break-word last:mb-0', className)}
      data-slot='p'
    >
      {children}
    </p>
  )
}
