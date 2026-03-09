///////////////////////////////////////////////////////////////////////////
//
// While this version works, prefer the useMergedRef hook, which was taken
// from Mantine. It was recently updated to handle React 19 ref cleanup callbacks.
//
// mergeRefs Usage:
// ref={mergeRefs(ref, internalRef)}
//
///////////////////////////////////////////////////////////////////////////

/** While this utility works, prefer the useMergedRef hook. */
export const mergeRefs = <T>(...refs: (React.Ref<T> | null | undefined)[]): React.RefCallback<T> => {
  return (node: T | null) => {
    refs.forEach((ref) => {
      if (!ref) return

      if (typeof ref === 'function') {
        ref(node)
      } else if (ref && typeof ref === 'object' && 'current' in ref) {
        ref.current = node
      }
    })
  }
}
