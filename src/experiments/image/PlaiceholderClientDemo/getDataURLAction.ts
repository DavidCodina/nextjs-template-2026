'use server'

import { getPlaiceholder } from 'plaiceholder'

type Data = {
  blurDataURL: string
  width: number
  height: number
}

type PreviousState = {
  data: Data | null
  message: string
  success: boolean
} | null

/* ========================================================================

======================================================================== */
// The plaiceholder library is designed to work in a Node.js environment and
// is not suitable for client-side rendering. This means that the function
// getDataURL in your file, which imports and uses getPlaiceholder, would
// not run correctly in a client component.

export const getDataURLAction = async (_previousState: PreviousState, imageUrl: string) => {
  try {
    const res = await fetch(imageUrl)

    const buffer = await res.arrayBuffer()
    const { base64, metadata } = await getPlaiceholder(Buffer.from(buffer))

    const data = {
      blurDataURL: base64,
      width: metadata.width,
      height: metadata.height
    }

    return {
      data,
      message: 'success',
      success: true
    }
  } catch {
    return {
      data: null,
      message: 'fail',
      success: false
    }
  }
}
