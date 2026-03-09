'use client'

import { useEffect } from 'react'

type Props = {
  callback?: () => void
  error?: Error
  random?: any
}

/* ========================================================================

======================================================================== */
///////////////////////////////////////////////////////////////////////////
//
// Usage within a server component:
//
//   <NotSerializableTest
//     callback={() => {
//       return "This won't work because it's not serializable."
//     }}
//     error={new Error('Whoops!')}
//   />
//
//
// When a function is passed as a prop from a server component to a client component, the function itself is
// not serialized - i.e., not serializable. Serialization is the process of converting an object into a format
// that can be transmitted across the network (e.g., JSON).
//
// On the client, the client component attempts to access the function,
// but it doesn't exist, leading to a hydration mismatch.
//
// When passing a function:
//
//    ⨯ Error: Functions cannot be passed directly to Client Components unless you explicitly expose
//    it by marking it with "use server". Or maybe you meant to call this function rather than return it.
//
//  When passing an Error:
//
//    ⨯ Error: Only plain objects, and a few built-ins, can be passed to Client Components from Server Components.
//    Classes or null prototypes are not supported.
//
// Other props that won't work when crossing the server/client threshold:
//
//   - Symbol values
//   - RegExp
//   - undefined
//   - Map
//   - Promises
//
// The fundamental reason for these limitations is the serialization process. When data needs to be sent from the
// server to the client (or vice versa), it must be converted into a format that can be transmitted over the
// network and then reconstructed on the other side. This process is called serialization (converting to a
// transmittable format) and deserialization (reconstructing the data from the transmitted format).
// In Next.js, and in many web technologies, JSON (JavaScript Object Notation) is used for this serialization process.
// JSON has a limited set of data types it can represent:
//
//   - Strings
//   - Numbers
//   - Booleans
//   - null
//    - Arrays
//   - Objects (with string keys)
//
// Any data structure or type that doesn't fit into these categories cannot be directly serialized to JSON.
//
// But just when you thought you had it all figured out, there's actually an exception to this rule.
// A server component can pass a server action to a client component as a prop, so technically that
// very specific type of function can pass through the server/client threshold:
//
//   const myAction = async () => {
//     'use server'
//     console.log("I can cross the server/client threshold because I'm a server action.")
//   }
//
//   <NotSerializableTest callback={myAction} />
//
///////////////////////////////////////////////////////////////////////////

export const NotSerializableTest = ({ callback, error }: Props) => {
  useEffect(() => {
    callback?.()
    // eslint-disable-next-line
  }, [])

  if (typeof error !== 'undefined') {
    console.log(error)
  }

  return null
}
