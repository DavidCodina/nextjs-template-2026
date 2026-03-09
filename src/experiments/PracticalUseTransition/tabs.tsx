'use client'

/* ========================================================================

======================================================================== */

export const About = () => {
  return (
    <div className='h-64 rounded-lg border border-neutral-300 bg-white p-4 shadow'>
      <h3 className='text-2xl font-black text-blue-500'>About:</h3>
      <p className='m-0'>Bla, bla, bla...</p>
    </div>
  )
}

/* ========================================================================

======================================================================== */

export const Contact = () => {
  return (
    <div className='h-64 rounded-lg border border-neutral-300 bg-white p-4 shadow'>
      <h3 className='text-2xl font-black text-blue-500'>Contact:</h3>
      <p className='m-0'>Bla, bla, bla...</p>
    </div>
  )
}

/* ========================================================================

======================================================================== */
//^ Slow render tab

export const Team = () => {
  const items = []
  for (let i = 0; i < 1000; i++) {
    items.push(<Person key={i} index={i} />)
  }

  return (
    <div className='flex h-64 flex-col rounded-lg border border-neutral-300 bg-white p-4 shadow'>
      <h3 className='text-2xl font-black text-blue-500'>Team:</h3>

      <div className='flex-1 overflow-scroll rounded-lg border border-blue-700 bg-blue-300 p-4'>
        <ul className='list-inside list-disc space-y-2'>{items}</ul>
      </div>
    </div>
  )
}

function Person({ index }: { index: number }) {
  const startTime = performance.now()
  while (performance.now() - startTime < 1) {
    // Do nothing for 1 ms per item to emulate extremely slow code
  }

  return <li className='text-md font-bold text-white'>Person {index + 1}</li>
}
