'use client'
import * as React from 'react'
import { getDataAction } from './getDataAction'
import { useWrappedActionState } from '../'

/* ========================================================================

======================================================================== */

export const Demo = () => {
  // No need for error, loading, or data states with React's useActionState,
  // but in normal useActionState, the returned action is not wrapped in a Transition.
  // Implement useWrappedActionState instead if you intend to use the action outside of
  // a form's action prop.
  const [state, action, isPending] = useWrappedActionState(getDataAction, null)

  const [count, setCount] = React.useState(0)

  React.useEffect(() => {
    // ⚠️ React.startTransition(() => action({ name: 'John Doe (1)' }))
    action({ name: 'John Doe (1)' })
  }, [action])

  const renderData = () => {
    // Unlike with normal loading/pending state, useActionState's
    // isPending is always initially false. This means we need to also
    // check if state is null when running the action on mount. This
    // also eliminates the need to use the `?` operator (i.e., state?.success) below.
    if (isPending || state === null) {
      //
      return <div className='text-center text-4xl font-black text-blue-500'>Loading Data...</div>
    }

    if (state.success === true) {
      return (
        <pre className='mx-auto max-w-lg rounded-lg border bg-white p-4 shadow'>
          <code>{JSON.stringify(state, null, 2)}</code>
        </pre>
      )
    }

    if (state.success === false) {
      return (
        <div className='mx-auto flex max-w-lg items-center justify-between rounded-lg border border-red-800 bg-red-50 p-2 text-center text-red-800 shadow'>
          <span>
            <strong>Error:</strong> unable to load data!
          </span>
          <button
            className='rounded-lg border border-red-800 bg-red-700 px-2 py-1 text-sm font-medium text-white'
            onClick={() => {
              // ⚠️ React.startTransition(() => action({ name: 'John Doe (2)' }))
              // ✅ action(undefined)
              action({ name: 'John Doe (2)' })
            }}
          >
            Retry
          </button>
        </div>
      )
    }

    // Avoid this case by checking: if (isPending || state === null)...
    return null
  }

  /* ======================
          return
  ====================== */

  return (
    <>
      <button
        className='mx-auto mb-6 block rounded bg-blue-500 px-2 py-1 font-bold text-white'
        onClick={() => setCount((v) => v + 1)}
      >
        count: {count}
      </button>
      {renderData()}
    </>
  )
}
