/* ======================

  ====================== */
///////////////////////////////////////////////////////////////////////////
//
// There's really only two things that cause JSON.stringify to throw (vs. silently mangle):
//
//   Circular references — the most common real-world case
//   BigInt values — throws "Do not know how to serialize a BigInt"
//
// Everything else (undefined, functions, Symbols) just gets silently dropped or
// replaced with null, so they won't crash anything.
//
// This would probably work better as a type guard.
//
///////////////////////////////////////////////////////////////////////////

type Serializable = string | number | boolean | null | Serializable[] | { [key: string]: Serializable }

export const isSerializable = (value: unknown): value is Serializable => {
  try {
    JSON.stringify(value)
    return true
  } catch {
    return false
  }
}
