'use client'

import * as React from 'react'
import { useTheme } from 'next-themes'
import { Button } from '@/components'
// import { ChatRoomBefore } from './ChatRoomBefore'
import { ChatRoomAfter } from './ChatRoomAfter'

/* ========================================================================

======================================================================== */
// https://www.youtube.com/watch?v=RQFpsnLkcQE&t=70s
// Ankita Kulkarni: https://www.youtube.com/watch?v=RQFpsnLkcQE&t=70s

export const UseEffectEventDemo = () => {
  const { resolvedTheme, setTheme } = useTheme()
  const [roomId, setRoomId] = React.useState('1')

  return (
    <>
      <Button
        className={'mx-auto my-6 flex'}
        onClick={() => {
          setTheme((prev) => (prev === 'light' ? 'dark' : 'light'))
        }}
        size='sm'
      >
        Toggle Theme
      </Button>

      <Button
        className={'my-g mx-auto flex'}
        onClick={() => {
          const newRoomId = Math.floor(Math.random() * 100).toString()
          setRoomId(newRoomId)
        }}
        size='sm'
        variant='secondary'
      >
        Room Id: {roomId}
      </Button>

      {/* <ChatRoomBefore roomId={'1'} theme={resolvedTheme} /> */}
      <ChatRoomAfter roomId={roomId} theme={resolvedTheme} />
    </>
  )
}
