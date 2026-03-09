import Image from 'next/image'
import { getImageData /*, getImagesData  */ } from './utils'
const remoteuImageURLString = 'https://images.unsplash.com/photo-1482192505345-5655af888cc4'

/* ========================================================================

======================================================================== */
///////////////////////////////////////////////////////////////////////////
//
// This demo demonstrates how to create a blurDataURL on the server for
// a remote image. However as a bonus, plaiceholder also gives us metadata
// that we can use to correctly set the image's dimensions.
//
// plaiceholder: https://plaiceholder.co/docs
//               https://plaiceholder.co/docs/plugins/next (I did not use this).
// Dave Gray:    https://www.youtube.com/watch?v=Bz3No1RFXWY
// Hamed Bahram: https://www.youtube.com/watch?v=XmeFI0da7iI
//
// https://plaiceholder.co/docs
// If you're not using the blurDataURL, but still want the dimensions, you can
// use : probe-image-size.
//
///////////////////////////////////////////////////////////////////////////

export const PlaiceholderServerDemo = async () => {
  const { data, success } = await getImageData(remoteuImageURLString)

  //# Maybe do something else besides return null...
  if (success !== true || !data) {
    return null
  }

  // Because it's a data URL, it will render immediately on the client
  // It doesn't need to make an additional network request.
  // console.log(data)

  return (
    <Image
      // blurDataURL={data.blurDataURL}
      // width={data.width}   // 4544
      // height={data.height} // 2840

      {...data}
      src={remoteuImageURLString}
      className='mx-auto mb-6 w-[800px] max-w-[calc(100vw-48px)] rounded-lg border border-black shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)]'
      alt='My Image'
      ///////////////////////////////////////////////////////////////////////////
      //
      // The 'responsive fixed' pattern (i.e., without fill).
      // Because width and height can be potentially huge, it's best to
      // use this pattern here. Otherwise, you'll be getting the benefits of
      // optimized loading and preventing cumulative layout shift, but also
      // potentially loading huge images unnecessarily.
      //
      // Was 661 kB.
      //
      // Setting it to '800px' reduced it further to 221 kB.
      //
      // Also, constraining it to '100vw' is a good idea if nothing else.
      //
      // For viewports that are 800px or smaller, the image size will be optimized to 100vw.
      // For viewports larger than 800px, the image size will be optimized to 800px.
      //
      // Zach G discusses this at 1:19:25      : https://www.youtube.com/watch?v=ZKG8JBdgSos
      // Dave Gray also discusses this at 9:00 : https://www.youtube.com/watch?v=gpJKj45AikY
      // This will have precedence over the height and width props such that even if we
      // set height and with to 50, it wouldn't really matter in regard to the image quality.
      // However, it wold still matter in regard to the layout shift. For that reason, the
      // actual height and width are still important for determining the aspect ratio.
      //
      // Combining both approaches allows the image to range between 34.5 - 221 kB.
      // Massive improvement!
      //
      ///////////////////////////////////////////////////////////////////////////

      sizes='(max-width: 800px) 100vw, 800px'
      placeholder='blur'
      priority
    />
  )
}
