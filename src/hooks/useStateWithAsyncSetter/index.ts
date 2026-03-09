import * as React from 'react'

type SetStateAction<State> = State | ((prevState: State) => State)
type AsyncSetState<State> = (value: SetStateAction<State>) => Promise<State>

/* ========================================================================

======================================================================== */
///////////////////////////////////////////////////////////////////////////
//
// This hook attempts to emulate the old class component setState callbacks.
// It's inspired by Robin Wieruch's useStateWithCallback hook:
//
//   https://www.robinwieruch.de/react-usestate-callback/
//   https://github.com/the-road-to-learn-react/use-state-with-callback/blob/master/src/index.js
//
// But this version doesn't implement a callback.
// Instead, the Promise returns the newState directly to the consumer.
//
///////////////////////////////////////////////////////////////////////////

export function useStateWithAsyncSetter<State>(initialState: State | (() => State)): [State, AsyncSetState<State>] {
  const [state, setState] = React.useState<State>(initialState)
  const resolversRef = React.useRef<((value: State) => void)[]>([])
  const currentStateRef = React.useRef<State>(state)

  // Keep ref in sync with state
  React.useEffect(() => {
    currentStateRef.current = state
  }, [state])

  React.useEffect(() => {
    // Resolve all pending promises with the current state value
    resolversRef.current.forEach((resolve) => resolve(state))
    resolversRef.current = []
  }, [state])

  // Separate effect for unmount cleanup
  React.useEffect(() => {
    return () => {
      resolversRef.current = [] // Only on unmount
    }
  }, [])

  const setStateAsync = React.useCallback((newState: SetStateAction<State>): Promise<State> => {
    return new Promise<State>((resolve) => {
      // Calculate what the new state will be
      const computedNewState =
        typeof newState === 'function' ? (newState as (prev: State) => State)(currentStateRef.current) : newState

      // Store a resolver that will resolve with the computed value
      resolversRef.current.push(() => resolve(computedNewState))
      setState(newState)
    })
  }, [])

  return [state, setStateAsync]
}
