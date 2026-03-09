'use client'

import { FadeUp } from './'

/* ========================================================================

======================================================================== */

export const FadeUpDemo = () => {
  const leftSection = (
    <div className='flex w-1/2 flex-col justify-center gap-6'>
      <FadeUp delay={1} duration={1} y={30}>
        <p className='rounded-lg border border-purple-400 bg-white p-4 text-xl text-gray-600 shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px]'>
          Discover a new way to interact with your smartphone. Our app brings cutting-edge features to your fingertips.
        </p>
      </FadeUp>

      <FadeUp delay={1.5} duration={1.5} y={30}>
        <p className='rounded-lg border border-purple-400 bg-white p-4 text-xl text-gray-600 shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px]'>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
          magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
          consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id
          est laborum.
        </p>
      </FadeUp>
    </div>
  )

  const rightSection = (
    <div className='flex w-1/2'>
      <FadeUp delay={2} duration={2} y={30}>
        <p className='rounded-lg border border-purple-400 bg-white p-4 text-xl text-gray-600 shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px]'>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
          magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
          consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id
          est laborum.
        </p>
      </FadeUp>
    </div>
  )

  /* ======================
          return
  ====================== */

  return (
    <section className='mx-auto max-w-[1000px]'>
      <div className='mb-6 w-[calc(50%-12px)]'>
        <FadeUp delay={0.5} duration={1} y={30}>
          <h1 className='bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-5xl font-black tracking-tighter text-transparent'>
            Revolutionize Your Mobile Experience
          </h1>
        </FadeUp>
      </div>

      <div className='flex gap-6'>
        {leftSection}
        {rightSection}
      </div>
    </section>
  )
}
