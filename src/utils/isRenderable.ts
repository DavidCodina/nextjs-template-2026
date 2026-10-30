import * as React from 'react'

/* ======================
      isRenderable()
====================== */
// This is useful when TypeScript needs to be assured that the return value
// of a component is, in fact, a ReactNode. It's a  preferable alternative
// to asserting `as React.ReactNode` in the component.

export const isRenderable = (value: unknown): value is React.ReactNode => {
  if (value === null || typeof value === 'boolean' || typeof value === 'undefined') return true
  if (typeof value === 'string') return true
  if (typeof value === 'number') return true
  if (typeof value === 'bigint') return true
  // Note: ReactPortal is covered by React.isValidElement
  if (React.isValidElement(value)) return true

  // Promise<AwaitedReactNode> is part of the ReactNode type (React 19+), but we can't
  // verify the resolved type at runtime. Including it for type fidelity, but a Promise
  // that resolves to a non-renderable value will still throw at render time.
  if (value instanceof Promise) return true

  // This checks for the Iterable<React.ReactNode> part of the ReactNode type.
  // Anything with a [Symbol.iterator] method, meaning React can loop over it and render each item.
  // The most common real-world examples: Arrays, Fragments, Sets, etc.
  if (Symbol.iterator in Object(value)) return true
  return false
}
