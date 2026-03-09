'use client'

import { useState, useMemo } from 'react'

// import { ErrorBoundary } from './ErrorBoundary'
// import { ErrorFallback } from './ErrorFallback'
// import { Data } from './Data'

import { Button } from 'components/Button'
import { DataWithUse } from './DataWithUse'
import { getData } from './getData'

/* ========================================================================

======================================================================== */
///////////////////////////////////////////////////////////////////////////
//
// This is what WDS example, but with some modifications: https://www.youtube.com/watch?v=zdNF9FJWJ8o&t
// The use() API allows for a purely client-side version of the Suspense paradigm.
// The use() + Suspense() pattern is an alternative to implementing a useEffect().
//
// Unfortunately, with use() + Suspense() the fetchPromise must be passed in from the parent.
// Similarly, the <Suspense> instance must also exist on the consuming side.
// This obviously implies that the loading fallback must also exist on the consuming side.
// This lack of self-containment is a significant downside. That said, in practice one can
// create a component that implements Suspense and passes props into the actual component.
// Then export that as an aliased version of the actual component:
//
//   const DataWithUseAndSuspense = (props: DataWithUseProps) => {
//     return (
//       <Suspense fallback={<h3>Loading...</h3>}>
//         <DataWithUse {...props} />
//       </Suspense>
//     )
//   }
//
//   export { DataWithUseAndSuspense as DataWithUse }
//
// In the above DataWithUseAndSuspense we would also bake in the fetchPromise and possibly the ErrorBoundary.
// Then the component becomes truly portable. This approach is similar to how one can bake a Context into
// a component without the user knowing that they're using an aliased version (i.e., ComponentWithContext).
// The real problem is that this is so much more complicated than simply implementing a useEffect().
// For that reason, I would suggest only ever implementing use() + Suspense() on the server side, but
// even then there would need to be a very good reason why the component needed the fetchPromise passed
// in as a prop from the outside. Presumably, this would only be when the component was intended to render
// data based on a dynamic promise result, which immediately sounds like a very niche use case.
//
// ⚠️ Conclusion: avoid `use()` unless there's a very specific reason for it.
// Also, the CompononentWithSuspense pattern is still a best-practice. I would not implement
// Supsense randomly on the consuming side. It's always better for it to be part of the component itself.
//
///////////////////////////////////////////////////////////////////////////

export const ClientComponentDemo = () => {
  const [count, setCount] = useState(0)
  const [_key, setKey] = useState(0) // Used to reset the ErrorBoundary
  const [url, setUrl] = useState({ value: '' })
  const [error, setError] = useState<Error | null>(null)

  ///////////////////////////////////////////////////////////////////////////
  //
  // ⚠️ Always implement useMemo() when creating the fetchPromise on the client side.
  // This Promise will fire on mount. Why are we implementing useMemo()?
  // This prevents running getData() on every render. For example,
  // if we merely did this:
  //
  //   const fetchPromise = getData(url.value)
  //
  // Then every time count changed, getData(url)() would run, and a new
  // API request would be made.
  //
  ///////////////////////////////////////////////////////////////////////////

  const fetchPromise = useMemo(() => getData(url.value), [url])

  /* ======================
      renderControls()
  ====================== */

  const renderControls = () => {
    return (
      <div className='mb-6 flex justify-center gap-2'>
        <Button
          onClick={() => {
            if (error) {
              setError(null)
              setKey((v) => v + 1)
            }
            setUrl({
              value: 'https://jsonplaceholder.typicode.com/users?_limit=5'
            })
          }}
          style={{ minWidth: 100 }}
        >
          Users
        </Button>

        <Button
          onClick={() => {
            if (error) {
              setError(null)
              setKey((v) => v + 1)
            }

            setUrl({
              value: 'https://jsonplaceholder.typicode.com/posts?_limit=5'
            })
          }}
          style={{ minWidth: 100 }}
        >
          Posts
        </Button>

        <Button
          className='btn-sky btn-sm'
          onClick={() => {
            if (error) {
              setError(null)
              setKey((v) => v + 1)
            }
            setUrl({
              value: 'https://jsonplaceholder.typicode.com/comments?_limit=5'
            })
          }}
          style={{ minWidth: 100 }}
        >
          Comments
        </Button>
      </div>
    )
  }

  /* ======================
        renderData()
  ====================== */
  ///////////////////////////////////////////////////////////////////////////
  //
  // Having an ErrorBoundary here is a valid way to handle errors, like the one that
  // will result from trying to get jsonplaceholder.typicode.co/posts.
  // However, it's not a great solution because nothing within the ErrorBoundary will
  // work until we reset it, and that's not super intuitive. Unfortunately, implementing
  // a try/catch inside of DataWithUse is not an option.
  //
  //   ❌ `use` was called from inside a try/catch block. This is not allowed and
  //   can lead to unexpected behavior. To handle errors triggered by `use`, wrap your
  //   component in a error boundary.
  //
  // In order to mitigate this issue, I had to add an onError callback to the
  // ErrorBoundary then set the error in local state here. Then on any of the buttons
  // that fetch data I check for error and then conditionally reset it back to null and
  // update the key state to force a re-render of the ErrorBoundary.
  //
  // This means we can catch any error in the Promise and then always return a standard response
  // of { data, message, success }. In turn, the DataWithUse component can conditionally render
  // based on the result of that object. Consequently, there's no need for an ErroBoundary at all.
  //
  ///////////////////////////////////////////////////////////////////////////

  const renderData = () => {
    return (
      <>
        {/* 
        <ErrorBoundary
          key={key}
          fallback={ErrorFallback}
          onReset={() => {
            setUrl({ value: '' })
            setKey((v) => v + 1)
          }}
          onError={({ error }) => {
            setError(error)
          }}
        > */}
        <DataWithUse
          onRetry={() => {
            // Because url is actually an object, the new object literal is a new reference,
            // so even though we're setting the same value property, the overall object is new.
            setUrl((prev) => {
              return { value: prev.value }
            })
          }}
          promise={fetchPromise}
          shouldFetch={url.value && typeof url.value === 'string' ? true : false}
        />

        {/* </ErrorBoundary> */}
      </>
    )
  }

  /* ======================
         return
  ====================== */

  return (
    <>
      <Button
        className='mx-auto mb-4 flex min-w-[150px]'
        onClick={() => {
          setCount((v) => v + 1)
        }}
      >
        Count: {count}
      </Button>

      {renderControls()}
      {renderData()}
    </>
  )
}
