'use client'

import { useEffect, useRef } from 'react'

const MyButton = ({ ref, children }: any) => {
  return (
    <button
      ref={(node) => {
        ref.current = node

        return () => {
          //ref.removeEventHanlder('change', handleInputChange)
          console.log('ref cleanup function invoked!!!')
        }
      }}
      className='btn-blue btn-sm mx-auto my-6 block'
    >
      {children}
    </button>
  )
}

/* ========================================================================

======================================================================== */
// In React 19, we no longer need forwardRef becuase function components
// can take in ref as a prop! ref callbacks now also accept a cleanup function
// Other random things with React 19:
// - It supports document <title> and <meta> tags directly within the component.
// - It supports <link rel="stylesheet" precedence="default" /> direclty within the component.
//   <link> can also be rendered in Suspense.
// - <link rel="preload" ... >, etc. will also work. See Lydia Hallie ReactConf 2024 at 2:46:30

export const RefPropDemo = () => {
  useEffect(() => {
    if (buttonRef.current) {
      console.log('MyButton:')
      console.dir(buttonRef.current)
    } else {
      console.log("Seems like there's no ref")
      console.dir(buttonRef)
    }
  }, [])

  const buttonRef = useRef<HTMLButtonElement | null>(null)
  return <MyButton ref={buttonRef}>Click Me</MyButton>
}
