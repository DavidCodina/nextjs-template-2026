'use client'

const MyButton = () => {
  const handleClick = () => {
    console.log('Button clicked!')
  }

  return (
    <button
      onClick={handleClick}
      className='relative overflow-hidden rounded-lg border border-white/20 bg-linear-to-r from-purple-500 via-pink-500 to-red-500 px-8 py-4 text-lg font-bold text-white shadow-lg shadow-purple-500/25 backdrop-blur-sm transition-all duration-300 ease-out before:absolute before:inset-0 before:translate-y-full before:bg-white/20 before:transition-transform before:duration-300 hover:scale-105 hover:shadow-xl hover:shadow-purple-500/40 hover:before:translate-y-0 active:scale-95'
    >
      <span className='relative z-10 flex items-center gap-2'>
        <svg
          className='h-5 w-5 transition-transform duration-300 group-hover:rotate-12'
          fill='none'
          stroke='currentColor'
          viewBox='0 0 24 24'
        >
          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M13 10V3L4 14h7v7l9-11h-7z' />
        </svg>
        Magic Button
      </span>
    </button>
  )
}

/* ========================================================================
              
======================================================================== */

export const ClientComponent = () => {
  return (
    <>
      <MyButton />
    </>
  )
}
