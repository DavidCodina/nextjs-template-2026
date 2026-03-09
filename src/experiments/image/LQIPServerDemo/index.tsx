import Image /*, { ImageProps } */ from 'next/image'
import lqip from 'lqip-modern'

/* ========================================================================

======================================================================== */
// This demo is for a Low Quality Image Placeholder.
// See Zach G at 42:45 : https://www.youtube.com/watch?v=ZKG8JBdgSos
// Similar to plaiceholder, lqip-modern will only run on the server.
// While you could use lqip-modern, plaiceholder is probably a better.

export const LQIPDemo = async () => {
  // In reality, this path would come from a database or some external data store, but we are hardcoding it here
  const url = new URL('https://images.unsplash.com/photo-1482192505345-5655af888cc4')
  const imgData = await fetch(url)
  const arrayBufferData = await imgData.arrayBuffer()
  const lqipData = await lqip(Buffer.from(arrayBufferData))

  /* ======================
         return
  ====================== */

  return (
    <>
      <Image
        alt='lqip-example'
        className={`mb-6 rounded-lg border border-black bg-[#333] object-contain shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)]`}
        placeholder='blur'
        src={url.href}
        width={lqipData.metadata.originalWidth}
        height={lqipData.metadata.originalHeight}
        blurDataURL={lqipData.metadata.dataURIBase64}
        priority
      />
    </>
  )
}
