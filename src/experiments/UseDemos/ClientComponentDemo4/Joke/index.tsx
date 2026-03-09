'use client'

import { useMemo, useState } from 'react'
// import { AlertCircle } from 'lucide-react'
import {
  // Alert,
  // Button,
  DataContainer
} from '@/components'
import { Joke } from './Joke'
// import { ErrorFallback } from './ErrorFallback'
import { getJoke } from './getJoke'

/* ========================================================================
                  
======================================================================== */
// This example is similar to the on in ClientComponentDemo3. However, rather
// than implementing an ErrorBoundary and Suspense directly, they are abstracted
// away by the DataContainer.
const JokeContainer = () => {
  // const [count, setCount] = useState(0)

  const [url, setUrl] = useState({
    value: 'https://api.chucknorris.io/jokes/random'
  })

  ///////////////////////////////////////////////////////////////////////////
  //
  // Now that the Promise is memoized, we also need a way of getting a new jokePromise.
  // This can be done with: setUrl(`https://api.chucknorris.io/jokes/random?now=${Date.now()}`)
  // You could also implement memoBuster state:
  //
  //   const [memoBuster, setMemoBuster] = useState(0)
  //   const jokePromise = useMemo(() => { return getJoke(url) }, [url, memoBuster])
  //
  // However, the easiest way to ensure that url is always new is to wrap it in an object.
  // Because objects are reference types, they will always be new.
  //
  ///////////////////////////////////////////////////////////////////////////

  const jokePromise = useMemo(() => {
    return getJoke(url.value)
  }, [url])

  /* ======================
          return
  ====================== */

  return (
    <>
      {/* <div className='mb-6 flex justify-center gap-4'>
        <Button
          className='min-w-[150px]'
          onClick={() => {
            setCount((v) => v + 1)
          }}
          size='sm'
          variant='success'
        >
          Count: {count}
        </Button>

        <Button
          className='min-w-[150px]'
          onClick={() => {
            setUrl({ value: 'https://api.chucknorris.io/jokes/random' })
          }}
          size='sm'
          variant='blue'
        >
          Get New Joke
        </Button>
      </div> */}

      {/* ⚠️ Rather than implementing the ErrorBoundary and Suspense 
      directly, they are abstracted into DataContainer. */}
      <DataContainer
        //
        // Case 1: ReactNode (i.e., JSX or a component instance)
        // fallback={
        //   <div className='mx-auto mb-6 flex max-w-[800px] items-center justify-between rounded-lg border border-red-600 bg-red-50 p-4 text-sm font-bold text-red-500 shadow-md'>
        //     <span>Whoops Something Bad Happened Bro!</span>
        //   </div>
        // }
        //
        // ======================
        //
        // Case 2: Element
        // FallbackComponent={ErrorFallback}
        //
        // ======================
        //
        // Case 3: Render Function
        // fallbackRender={(fallbackProps) => {
        //   const { error, resetErrorBoundary } = fallbackProps
        //   const originalError = error instanceof Error ? error.message : ''
        //   const message = originalError || 'Oh no! Something bad happened!'
        //   return (
        //     <Alert
        //       className='mx-auto mb-6 max-w-[600px]'
        //       leftSection={<AlertCircle className='size-6' />}
        //       rightSection={
        //         <Button
        //           className='min-w-[100px] self-center'
        //           onClick={resetErrorBoundary}
        //           size='sm'
        //           variant='info'
        //         >
        //           Reset
        //         </Button>
        //       }
        //       title='Error'
        //       variant='info'
        //     >
        //       {message}
        //     </Alert>
        //   )
        // }}
        //
        // ======================
        //
        // Case 4: DataContainer has an internal default fallbackRender.
        // Omit cases 1, 2, and 3 and the default will be used. Add errorMessage
        // to overwrite the default errorMessage of 'Request Failed.' Alternatively,
        // use showOriginalError to show the original error message (discouraged)..
        errorMessage='Something very bad happened!'
        showOriginalError
        onReset={(_details) => {
          // Wrap the URL in a new object reference. Otherwise, the boundary will be
          // reset, but the memoized jokePromise will still resolve to the old error.
          setUrl({ value: 'https://api.chucknorris.io/jokes/random' })
        }}
        onError={(_error, _info) => {
          // console.log('error from onError:', error)
          // console.log('info from onError:', info)
        }}
        // ⚠️ Don't do this in production. It will cause a cumulative layout shift.
        suspenseFallback={<h2 className='mt-6 text-center text-3xl font-black text-violet-800'>Loading...</h2>}
      >
        <Joke
          onRefresh={() => {
            console.log('onRefresh() called')
            setUrl({ value: 'https://api.chucknorris.io/jokes/random' })
          }}
          jokePromise={jokePromise}
        />
      </DataContainer>
    </>
  )
}

export { JokeContainer as Joke }
