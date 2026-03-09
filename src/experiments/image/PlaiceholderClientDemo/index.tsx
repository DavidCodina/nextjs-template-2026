'use client'

import { useEffect, useActionState } from 'react'
import Image from 'next/image'
import { getDataURLAction } from './getDataURLAction'

const urlString = 'https://images.unsplash.com/photo-1482192505345-5655af888cc4'

/* ========================================================================

======================================================================== */
// This demo shows that it is possible to integrate plaiceholder for a client
// component through the use of a server action. That said, this is arguably a bad
// idea because it would likely still result in layout shift because the component
// is iniially rendered with no image, and only once the getDataURLAction() request
// completes will we show the image. That seems to be defeating the purpose.
//
// The other major problem here is that actions always run sequentially, so if you
// had a lot of images doing this, you'd get a really bad waterfall. Thus, even
// though this is possible, it's probably a bad idea.

export const PlaiceholderClientDemo = () => {
  const [state, action, _pending] = useActionState(getDataURLAction, null)

  useEffect(() => {
    action(urlString)
    // eslint-disable-next-line
  }, [])

  if (!state || state.success !== true || !state.data) {
    return null
  }

  const { data } = state

  return (
    <>
      <Image
        src={urlString}
        className='mx-auto mb-6 max-w-[800px] rounded-lg border border-black shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)]'
        alt='My Image'
        width={data.width} // 4544
        height={data.height} // 2840
        sizes='800px' // Was 661 kB. This reduced it further to 221 kB.
        placeholder='blur'
        blurDataURL={data.blurDataURL}
        priority
      />
    </>
  )
}
