'use client'

import * as React from 'react'

import { Button } from '@/components'
// import { ClickCounter } from './ClickCounter'
// import { EffectData } from './EffectData'
import { SuspenseData } from './SuspenseData'

/* ========================================================================

======================================================================== */

// const StandardImplementation = () => {
//   const [isVisible, setIsVisible] = React.useState(false)
//   return (
//     <>
//       <div className='mb-6 flex flex-col items-center gap-6'>
//         <Button
//           className='min-w-[200px]'
//           onClick={() => {
//             setIsVisible((v) => !v)
//           }}
//           size='sm'
//         >
//           {isVisible ? 'Hide Content' : 'Show Content'}
//         </Button>
//         {isVisible && (
//           <>
//             <ClickCounter />

//             <EffectData />
//           </>
//         )}
//       </div>
//     </>
//   )
// }

/* ========================================================================

======================================================================== */
///////////////////////////////////////////////////////////////////////////
//
// Web Dev Simplified: https://www.youtube.com/watch?v=Ubbb1RK7iFs
// At 3:45, Kyle shows a clever trick where he preloads data with Suspense
// In his example, he implements useSuspenseQuery() from Tanstack Query.
// I did something similar, but just used the use() API.
//
//# Todo: Better Stack - https://www.youtube.com/watch?v=MeYCmCqnG3o
//
// https://react.dev/reference/react/Activity
// https://medium.com/@abhishekkrpand1/react-19-2-activity-hide-components-without-losing-state-64a60cc513fb
//
/////////////////////////
//
// <Activity> lets you hide and restore the UI and internal state of its children.
// In some cases we may want to remove the JSX / components from the UI, but not unmount them
// entirely. In this case, state will persist, but the useEffect will be cleaned up.
//
// How it works:
//
// The <Activity> component is doing something quite clever that's neither a simple CSS hide nor a full
// unmount. Here's what's actually happening under the hood:
//
// When mode="hidden":
//
//   1. CSS Hiding: React applies display: none to the children, so the DOM elements stay in place but are hidden visually.
//      It literally adds: style="display: none !important;" to the HTML.
//
//   2. Effect Cleanup: All of the children's Effects are cleaned up (cleanup functions run), and subscriptions are removed.
//      This is why your console.log('Clean up function called.') fires when you hide the component
//
//   3. State Preservation: React saves the component's internal state for later, keeping fiber nodes and state in memory
//
//   4. Low-Priority Rendering: Hidden components continue to render to the Virtual DOM at extremely low priority, staying up-to-date
//      in the background without blocking main thread operations
//
//
// When switching back to mode="visible":
//
//   - React restores the children with their previous state and re-creates their Effects
//
//   - Your useEffect runs again (setting up the event listener)
//
//   - The component appears instantly because the DOM was never destroyed
//
// Think of it as "conceptually unmounted but technically still there". React conceptually treats hidden
// Activities as being unmounted, but keeps their state alive React. It's like putting the component to sleep
// - all active subscriptions and side effects are paused, but the component's memory (state + DOM structure) remains intact.
//
///////////////////////////////////////////////////////////////////////////

const ActivityImplementation = () => {
  const [isVisible, setIsVisible] = React.useState(false)
  return (
    <>
      <div className='mb-6 flex flex-col items-center gap-6'>
        <Button
          className='min-w-[200px]'
          onClick={() => {
            setIsVisible((v) => !v)
          }}
          size='sm'
        >
          {isVisible ? 'Hide Content' : 'Show Content'}
        </Button>

        <React.Activity mode={isVisible ? 'visible' : 'hidden'}>
          <SuspenseData />
        </React.Activity>
      </div>
    </>
  )
}

/* ========================================================================

======================================================================== */

export const ActivityDemo = () => {
  return (
    <>
      <h1 className='text-primary mb-6 text-center text-3xl font-black'>Activity Demo</h1>
      {/* <StandardImplementation /> */}
      <ActivityImplementation />
    </>
  )
}
