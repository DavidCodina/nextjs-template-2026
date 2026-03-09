'use client'

import { Snippet } from '../'

/* ========================================================================

======================================================================== */

export const SnippetDemo = () => {
  return (
    <Snippet
      showLineNumbers={false}
      className='mb-8'
      code={`<div className='mb-8 grid auto-rows-[minmax(100px,auto)] gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
  <div className='bg-backround-light rounded-lg border p-4'></div>
  <div className='bg-backround-light rounded-lg border p-4'></div>
  <div className='bg-backround-light rounded-lg border p-4'></div>
  <div className='bg-backround-light rounded-lg border p-4'></div>
</div>`}
    />
  )
}
