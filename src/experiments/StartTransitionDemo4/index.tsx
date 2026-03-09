'use client'
import { useTransition, useState } from 'react'

/* ========================================================================

======================================================================== */
// Initially, one of the most challenging things about useTranisition was realizing, that
// in most cases, you simply don't need it.
//
// useTransition shines in apps dealing with hefty data loads or complex UI interactions.
// It's like a safety net for those edge cases where performance might take a hit.
// For most day-to-day updates in typical apps, you might not see a blocking issue often.
// But knowing how to use useTransition means you're equipped to handle those more demanding
// scenarios when they do arise.
//
// The only real need I've seen for useTransition thus far, is when you want to implement
// useOptimistic.

export const StartTransitionDemo4 = () => {
  const [isPending, startTransition] = useTransition()
  const [data, setData] = useState<any[]>([])
  const [input, setInput] = useState('')

  const handleInputChange = (e: any) => {
    setInput(e.target.value)
    startTransition(() => {
      const items = []
      for (let i = 0; i < 100000; i++) {
        items.push(i)
      }
      setData(items)
    })
  }

  const renderEchoChamber = () => {
    if (isPending) {
      return <div className='my-6 text-center text-3xl font-black text-blue-500'>Echoing...</div>
    }

    if (!Array.isArray(data) || data.length === 0 || input.length === 0) {
      return (
        <section className='flex aspect-video flex-wrap items-center justify-center gap-4 overflow-y-auto rounded border border-neutral-400 bg-white p-4'>
          <div className='text-3xl font-black text-blue-500'>Echo Chamber</div>
        </section>
      )
    }

    return (
      <section className='flex aspect-video flex-wrap gap-4 overflow-y-auto rounded border border-neutral-400 bg-white p-4'>
        {data.map((item, index) => (
          <div className='rounded-lg bg-green-500 p-1 text-xs text-white' key={index}>
            {input}
          </div>
        ))}
      </section>
    )
  }

  return (
    <div className='mx-auto max-w-[400px]'>
      <input className='form-control form-control-sm mb-6' type='text' value={input} onChange={handleInputChange} />
      {renderEchoChamber()}
    </div>
  )
}
