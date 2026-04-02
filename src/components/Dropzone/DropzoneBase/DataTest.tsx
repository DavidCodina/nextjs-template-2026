'use client'

/* ========================================================================

======================================================================== */
// The File object in JavaScript contains a lot of prototype methods and properties
// that are not enumerable. When you use JSON.stringify(), it only serializes the enumerable
// own properties of the object, and path is one of them. If you want to display other properties
// like name, size, type, etc., you can create a new object that only contains the properties
// you’re interested in, and then stringify that object.

export const DataTest = ({ files }: { files: File[] | null }) => {
  /* ======================
          return
  ====================== */

  if (!Array.isArray(files) || files.length === 0) return null

  return (
    <pre className='mx-auto mt-6 w-full rounded-xl border-2 border-green-500 bg-neutral-900 p-6 text-sm text-green-500 shadow'>
      <code>
        {files
          .map((file) => {
            const { name, size, type } = file
            return JSON.stringify({ name, size, type }, null, 2)
          })
          .join(', \n\n')}
      </code>
    </pre>
  )
}
