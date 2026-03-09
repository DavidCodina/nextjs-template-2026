import * as React from 'react'

// These are the same overloads that you'd see if you inspected React's useActionState.
export function useWrappedActionState<State>(
  action: (state: Awaited<State>) => State | Promise<State>,
  initialState: Awaited<State>,
  permalink?: string
): [state: Awaited<State>, dispatch: () => void, isPending: boolean]

export function useWrappedActionState<State, Payload>(
  action: (state: Awaited<State>, payload: Payload) => State | Promise<State>,
  initialState: Awaited<State>,
  permalink?: string
): [state: Awaited<State>, dispatch: (payload: Payload) => void, isPending: boolean]

/* ======================

====================== */

export function useWrappedActionState<State, Payload>(
  action: (state: Awaited<State>, payload?: Payload) => State | Promise<State>,
  initialState: Awaited<State>,
  permalink?: string
) {
  const [state, formAction, isPending] = React.useActionState<State, Payload | undefined>(
    action,
    initialState,
    permalink
  )

  // ⚠️ useCallback() to avoid infinite loops when used in useEffect dependency array.
  const wrappedAction = React.useCallback((payload?: Payload) => {
    console.log('wrappedAction() fired.')
    React.startTransition(() => {
      formAction(payload)
    })
  }, []) // eslint-disable-line

  return [state, wrappedAction, isPending]
}
