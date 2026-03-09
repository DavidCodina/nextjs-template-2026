'use client'

import { Suspense, useMemo, useState } from 'react'
import { ErrorBoundary } from 'react-error-boundary'

import { Joke } from './Joke'
import { ErrorFallback } from './ErrorFallback'
import { getJoke } from './getJoke'

/* ========================================================================
                  
======================================================================== */

const JokeContainer = () => {
  const [url, setUrl] = useState({
    value: 'https://api.chucknorris.io/jokes/random'
  })

  // Now that the Promise is memoized, we also need a way of getting a new jokePromise.
  // This is done with: setUrl(`https://api.chucknorris.io/jokes/random?now=${now}`)
  // This is not done here, but can be done...
  const jokePromise = useMemo(() => getJoke(url.value), [url])

  return (
    <ErrorBoundary
      fallback={<ErrorFallback />}
      onReset={() => {
        // Wrap the URL in a new object reference. Otherwise, the boundary will be
        // reset, but the memoized jokePromise will still resolve to the old error.
        setUrl({ value: 'https://api.chucknorris.io/jokes/random' })
      }}
    >
      <Suspense
        // Obviously, this is bad because it will create cumulative layout shift,
        // so don't do this in production.
        fallback={<h3 className='mb-6 text-center text-2xl leading-none font-black text-violet-800'>Loading...</h3>}
      >
        <Joke jokePromise={jokePromise} />
      </Suspense>
    </ErrorBoundary>
  )
}

export { JokeContainer as Joke }
