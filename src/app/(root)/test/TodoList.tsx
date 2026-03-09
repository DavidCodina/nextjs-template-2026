'use client'

import { List } from '@mantine/core'
import { CircleCheckBig } from 'lucide-react'

/* ========================================================================
              
======================================================================== */

export const TodoList = () => {
  /* ======================
          return
  ====================== */

  return (
    <>
      <List
        className='bg-card mx-auto w-full max-w-150 divide-y overflow-x-auto rounded-lg border shadow-sm *:p-2'
        // type='ordered' // Must also add 'list-decimal' className
        // start={1}
        // spacing='lg'
        size='sm'
        // center
        icon={<CircleCheckBig className='text-success' />}
      >
        <List.Item>
          Review <code className='text-pink-500'>experiments/</code> folder.
        </List.Item>

        <List.Item>
          Deep dive on Tailwind's <code className='text-pink-500'>@theme</code> directive.
        </List.Item>

        <List.Item>Work on Playwright</List.Item>

        <List.Item>Update actions folder</List.Item>

        <List.Item>Update Sonner based on what was done in Expo app.</List.Item>
      </List>
    </>
  )
}
