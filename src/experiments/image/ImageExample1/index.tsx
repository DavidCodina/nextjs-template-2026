'use client'

// import Image /* , { ImageProps } */ from 'next/image'
// import PublicPeter from '../../../../../public/PublicPeter.png'
import _PublicPeter from 'public/PublicPeter.png'

/* ========================================================================

======================================================================== */
// https://nextjs.org/docs/pages/api-reference/components/image
// https://nextjs.org/docs/pages/building-your-application/optimizing/images
// https://vercel.com/templates/next.js/image-fallback
//
// https://web.dev/articles/vitals
// https://www.mydevice.io/
// https://developer.mozilla.org/en-US/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images
// https://www.imgix.com/
// https://imagekit.io/
// https://cloudinary.com/
// https://tinypng.com/
// https://uploadthing.com/ (Theo)

//# Next.js' Image component doesn't have a built-in way to specify a fallback
//# image directly. However, you can use the onError event to set up a fallback
//# image. Here’s how you can do it:

// import { useState } from 'react';
// import Image from 'next/image';

// const CustomImage = ({ src, fallbackSrc, ...props }) => {
//   const [imgSrc, setImgSrc] = useState(src);

//   return (
//     <Image
//       {...props}
//       src={imgSrc}
//       onError={() => setImgSrc(fallbackSrc)}
//       alt={props.alt}
//     />
//   );
// };

// // Usage
// <CustomImage
//   src='/landscape.jpg'
//   fallbackSrc='/fallback.jpg'
//   width={500}
//   height={500}
//   className={`mx-auto mb-6 block h-[300px] w-[300px] rounded-lg border-2 border-black bg-[#333] object-contain shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)]`}
//   quality={75}
//   alt='Random Image'
//   priority
// />

//# The above example is from AI.
//# See Next.js for their own demo: https://vercel.com/templates/next.js/image-fallback
//# More generally, I would look at all their tamplates.
export const ImageExample1 = () => {
  /* ======================
         return
  ====================== */

  return (
    <>
      {/* 

      // When src is a string URL:
      //
      //   src={'https://upload.wikimedia.org/wikipedia/en/c/c2/Peter_Griffin.png'}
      //   src='/PublicPeter.png'
      //
      // You must have a width and height (or use fill).

      
      */}

      {/* =====================
        Confine Image to container's dimensions without distorting
      ===================== */}

      {/* In this case, the size of the container is changing dynamically as the viewport changes.
      In theory, you could do this:

        height={500}
        width={1500}

      And that would work fine. However, this is actually a good use case for using the fill prop
      in conjunction with a wrapper div. See ByteGrad at 30:30: https://www.youtube.com/watch?v=XL3gth5Bmjw */}

      {/* <div className='relative mx-auto mb-6 aspect-[3/1] w-full overflow-hidden rounded-lg border border-neutral-400 shadow'>
        <Image
          // src='/PublicPeter.png'
          // src='https://upload.wikimedia.org/wikipedia/en/c/c2/Peter_Griffin.png'
          // src={PublicPeter}
          src='/landscape.jpg'
          // A boolean that causes the image to fill the parent element, which
          // is useful when the width and height are unknown. However, fill by
          // itself will lead to image distortions, so it's best to use it
          // in conjunction with objectFit. The fill + objectFit combo works
          // for both src types of string or StaticImageData.
          //
          // If src is a string then when you refresh the page, there may be
          // a flash of the distorted image before objectFit: 'contain' is applied.
          // However, this seems to only be an issue in development mode. Moreover,
          // it seems like the priority prop also fixes this.
          //# What is fill actually doing under the hood? Why does Lee suggest we use it with the sizes prop?
          fill={true}
          alt='Random Image'
          className='object-cover'
          // If you're using an external image, then you also need to include the blurDataURL
          // See ByteGrat at 17:30 : https://www.youtube.com/watch?v=XL3gth5Bmjw
          // placeholder='blur'

          // https://nextjs.org/docs/pages/api-reference/components/image#priority
          // "When true, the image will be considered high priority and preload. Lazy loading 
          // is automatically disabled for images using priority."
          // priority: See Sonny Sangha at 17:00 : https://www.youtube.com/watch?v=2U7yZ3wvFBM
          //           See Dave Gray at 16:00    : https://www.youtube.com/watch?v=gpJKj45AikY
          //^ priority

          // https://nextjs.org/docs/app/api-reference/components/image#loader
          // loader: See Sonny Sangha at 18:35 : https://www.youtube.com/watch?v=2U7yZ3wvFBM
          //         See Zach G at 27:15       : https://www.youtube.com/watch?v=ZKG8JBdgSos
          //^ loader

          // https://nextjs.org/docs/pages/api-reference/components/image#sizes
          // "The value of sizes will greatly affect performance for images using fill"
          // sizes: See Dave Gray at 8:45 : https://www.youtube.com/watch?v=gpJKj45AikY
          //        See Zach G at 14:00   : https://www.youtube.com/watch?v=ZKG8JBdgSos
          //        See Zach G at 1:06:45 : https://www.youtube.com/watch?v=ZKG8JBdgSos   
          //^ sizes

          // See Zach G at 25:45 : https://www.youtube.com/watch?v=ZKG8JBdgSos
          
          //^ unoptimized

          //^ onLoad 

           // See Zach G at 42:45 : https://www.youtube.com/watch?v=ZKG8JBdgSos
          //^ placeholder="blur"

          //^ onError
        />
      </div> */}

      {/* =====================
       Confine Image to self (<img>) without distorting.
      ===================== */}
      {/* Often there's no reason to even use a container.
      One possible reason for an actual container is when the that container is
      changing in size. Then it might make more sense to use the container in conjunction with fill.
      
      When applying objectFit: 'contain' + setting dimensions on the <img> the
      actual image inside the <img> will already get contained and centered. 
      In other words, conceptually there is a difference between an <img> and
      the image displayed within an <img>. The <img> IS the container. */}

      {/* <Image
        ///////////////////////////////////////////////////////////////////////////
        //
        // Note: In this case, we're actually referencing images in public.
        // In such cases where the image is actually in public, or in some other project
        // folder, you actually want to import the StaticImageData instead. Then you can
        // completely omit the height and with props. Additionally, placeholder="blur" will then
        // also work without also needing the blurDataURL prop.
        //
        ///////////////////////////////////////////////////////////////////////////
        // src='/portrait.jpg'
        src='/landscape.jpg'
        className={`
          mx-auto mb-6 block h-[300px] w-[300px] rounded-lg border-2 border-black 
          bg-[#333] object-contain shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)]
        `}
        ///////////////////////////////////////////////////////////////////////////
        //
        // Think of these dimensions primarily for optimization.
        // Unless you know the exact dimensions, all that really matters is that it's large enough
        // to look good. For example, you wouldn't want it to be 50x50 if you actually intend the CSS
        // to show it as 500 pixels wide. That would result in a blurry granular image.
        // It's best not to think of these attributes as the final width and height, but more as an
        // approximate size for optimizing.
        //
        //   https://nextjs.org/docs/pages/building-your-application/optimizing/images#remote-images
        //   The width and height attributes are used to infer the correct aspect ratio of image and
        //   avoid layout shift from the image loading in. The width and height do not determine the
        //   rendered size of the image file.
        //
        // Always set width/height equal to or larger than your intended display size
        //
        // If possible, try to set it to expected aspect ratio, though not necessarily the exact pixel size.
        //
        // Setting them too small (like 100px) when displaying at 400px would result in upscaling and blur
        //
        // Setting them much larger than needed (like 2000px) would unnecessarily increase the file size
        //
        // The height and width attributes in Next.js Image component serve primarily as optimization
        // hints rather than styling controls.
        //
        // These attributes are different from standard HTML img width/height attributes
        //
        // They're used by Next.js's image optimization pipeline to generate appropriate sizes
        //
        // They don't directly control the visual size like traditional HTML attributes would
        //
        // See also  Dave Gray at 2:35 : https://www.youtube.com/watch?v=gpJKj45AikY
        //
        ///////////////////////////////////////////////////////////////////////////
        height={500}
        width={500}
        quality={75} // default
        alt='Random Image'
        // priority // Will prevent jankiness when refresing in dev mode.
      /> */}

      {/* =====================
      Set width, auto height
      ===================== */}
      {/* This will necessarily lead to vertical cumulative layout shift during loading.
      That's the trade-off for auto height. This is always the case with <img> 
      too. It's just that Next.js is trying to protect you from that. CLS is one of the
      the worst things you can do to your web vitals, so unless you absolutely can't think
      of a better approach, then don't do this.https://web.dev/articles/vitals 
      
      That said, CLS is probably inherent to masonry layouts, so in some cases it's unavoidable.
      Ideally, you should know the dimensions of your images. For example, if you're uploading images, 
      then rather than storing just a property of image: 'https://...', it might be better to 
      store an object that contains the URL as well as metadata about the image.

      Zach G at 1:01:15 of : https://www.youtube.com/watch?v=ZKG8JBdgSos
      suggests something like this: { src, width, height }.

      */}

      {/* <Image
        src='https://upload.wikimedia.org/wikipedia/en/c/c2/Peter_Griffin.png'
        width={500}
        height={500}
        className='w-[200px] bg-white'
        alt='Random Image'
      /> */}

      {/* =====================
      Set height, auto width
      ===================== */}
      {/* This will necessarily lead to horizontal cumulative layout shift during loading.
      That's the trade-off for auto height. This is always the case with <img> 
      too. It's just that Next.js is trying to protect you from that. CLS is one of the
      the worst things you can do to your web vitals, so unless you absolutely can't think
      of a better approach, then don't do this. https://web.dev/articles/vitals */}

      {/* <Image
        src='https://upload.wikimedia.org/wikipedia/en/c/c2/Peter_Griffin.png'
        height={500}
        width={500}
        className='h-[300px] w-auto bg-white'
        alt='Random Image'
      /> */}

      {/* =====================

      ===================== */}
    </>
  )
}
