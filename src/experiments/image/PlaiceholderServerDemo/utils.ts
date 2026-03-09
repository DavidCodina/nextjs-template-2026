import { getPlaiceholder } from 'plaiceholder'

type ImageData = {
  URL: string
  blurDataURL: string
  width: number
  height: number
}

/* ========================================================================

======================================================================== */
// The plaiceholder library is designed to work in a Node.js environment and
// is not suitable for client-side rendering. This means that the function
// getDataURL in your file, which imports and uses getPlaiceholder, would
// not run correctly in a client component.

export const getImageData = async (URL: string) => {
  try {
    const res = await fetch(URL)

    const buffer = await res.arrayBuffer()
    const { base64, metadata } = await getPlaiceholder(Buffer.from(buffer))

    const result: ImageData = {
      URL: URL,
      blurDataURL: base64,
      width: metadata.width,
      height: metadata.height
    }

    return {
      data: result,
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

/* ========================================================================

======================================================================== */

export const getImagesData = async (URLs: string[]) => {
  try {
    const promises = URLs.map((URL) => getImageData(URL))
    const settledPromises = await Promise.allSettled(promises)

    const results = settledPromises

      .map((x: any) => {
        if (x?.value?.success === true && x?.value?.data && typeof x?.value?.data === 'object') {
          return x.value.data
        }
        return null
      })
      .filter(Boolean) as ImageData[]

    return {
      data: results,
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
