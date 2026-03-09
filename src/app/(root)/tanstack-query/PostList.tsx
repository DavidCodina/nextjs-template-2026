'use client'

import { QueryErrorResetBoundary, useSuspenseQuery } from '@tanstack/react-query'
import { ErrorBoundary } from 'react-error-boundary'
import { getPosts } from './getPosts'
// import { getPostsAction } from './getPostsAction'

/* ========================================================================
              
======================================================================== */

const PostList = () => {
  const {
    data
    // isError, error, status are dead code. With useSuspenseQuery, data is always
    // defined, and errors are thrown to the nearest error boundary instead of returned.
    // ❌ isError, error,  status
  } = useSuspenseQuery({
    queryKey: ['posts'],
    ///////////////////////////////////////////////////////////////////////////
    //
    // ⚠️ Why `await Promise.resolve()` is here:
    //
    //   queryFn: async () => {
    //     await Promise.resolve()
    //     return getPostsAction()
    //   }
    //
    // Without it, React logs this error in the console:
    //
    //   Cannot update a component (`Router`) while rendering a different component
    //   (`PostList`). To locate the bad setState() call inside `PostList`, follow
    //   the stack trace as described in https://react.dev/link/setstate-in-render
    //
    // The cause: when useSuspenseQuery has no cached data, it calls the queryFn
    // synchronously during PostList's render so it can get a promise to suspend on.
    // On the client, a server action isn't the function itself. It's a stub that
    // POSTs to the server and updates Next.js's router state (the `Router`
    // component). That update happens as soon as the stub is called, so calling
    // the action directly as the queryFn triggers a router setState in the middle
    // of PostList's render.
    //
    // The fix: `await Promise.resolve()` yields to the microtask queue, so the
    // actual call to getPostsAction() happens after the current synchronous render
    // work has finished. A microtask can't run in the middle of a component's
    // render, so the router update lands outside of it. Suspense still works
    // because the queryFn still returns a promise.
    //
    // Is this hacky? A little. It's a workaround, not an official pattern.
    // Server actions are designed for mutations triggered from event handlers or
    // forms, not for being called during render, and this relies on two
    // implementation details: that queryFn runs synchronously during render, and
    // that the action stub updates router state immediately. If either changes,
    // the workaround may become unnecessary. It's also low-risk: the deferral is
    // harmless, and if it ever stops working, the only symptom is the same
    // console warning, not broken behavior.
    //
    // Caveats of server actions as queries in general: Next.js runs actions
    // sequentially (not in parallel), and thrown error messages are sanitized in
    // production.
    //
    ///////////////////////////////////////////////////////////////////////////

    queryFn: getPosts
    // retry: false
  })

  /* ======================

  ====================== */

  return (
    <ul>
      {data.map((post) => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  )
}

/* ========================================================================
              
======================================================================== */
// To mitigate this pain point, we could write the boundary once and reuse it.
// The other solution would be to catch within getPosts() and then check for
// errors as data. While the latter solution would technically work, it's also
// going against the conventional usage pattern for TanStack Query's queryFn.

const PostListWithErrorBoundary = () => {
  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <ErrorBoundary
          onReset={reset}
          fallbackRender={({ error, resetErrorBoundary }) => (
            <div className='bg-card mx-auto my-6 w-fit rounded-lg border p-6 text-center shadow-sm'>
              <p className='mb-6 text-2xl font-bold text-red-500'>
                Error: {error instanceof Error ? error.message : 'Something went wrong'}
              </p>

              <button
                className='min-w-25 cursor-pointer rounded bg-red-500 px-2 py-1 text-sm font-bold text-white'
                onClick={resetErrorBoundary}
              >
                Retry
              </button>
            </div>
          )}
        >
          <PostList />
        </ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  )
}

export { PostListWithErrorBoundary as PostList }
