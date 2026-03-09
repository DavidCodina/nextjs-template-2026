import { isJSON } from '../isJSON'
import type { z } from 'zod'

/* ======================
      isZodIssues()
====================== */

type ZodIssues = z.ZodError['issues']
type ZodIssue = ZodIssues[number]
// Omits optional `input` property.
type ZodIssueLike = Pick<ZodIssue, 'code' | 'path' | 'message'>

///////////////////////////////////////////////////////////////////////////
//
// The three properties that are always present on every ZodIssue are:
//
//   - code    (string)
//   - message (string)
//   - path    ((string | number)[])
//
// Other properties like inclusive, minimum, origin, etc. appear conditionally.
//
// Previously, I was doing this:
//
//  export const isZodIssues = (value: unknown): value is ZodIssues => {
//
// It used to claim value is ZodIssues - the full Zod issue union with all its conditional fields.
// But the guard only checks three properties, so the claim was bigger than what the code verifies.
// ZodIssueLike describes exactly what the guard checks. Pick works on the union because those
// three keys exist on every member.
//
///////////////////////////////////////////////////////////////////////////

export const isZodIssues = (value: unknown): value is ZodIssueLike[] => {
  // Must be an array
  // Empty arrays aren't valid Zod issues arrays
  if (!Array.isArray(value) || value.length === 0) {
    return false
  }

  // Check if every element looks like a ZodIssue
  return value.every((item) => {
    // Must be an object
    if (typeof item !== 'object' || item === null) {
      return false
    }

    const issue = item as Record<string, unknown>

    // Required properties that every ZodIssue has
    return typeof issue.code === 'string' && Array.isArray(issue.path) && typeof issue.message === 'string'
  })
}

/* ======================
    formatZodIssues()
====================== */

///////////////////////////////////////////////////////////////////////////
//
// Key used for issues that aren't tied to a specific field (path: []).
// Examples: object-level .refine()/.superRefine(), or a body that isn't
// an object at all (null, array, string, undefined).
//
// ⚠️ If you change this, it will affect ALL application code that checks for
// errors with the literal value 'root'. Consequently, it's better for all
// error checks import the ZOD_ROOT_ERROR_KEY, or NEVER EVER CHANGE THIS VALUE!
//
///////////////////////////////////////////////////////////////////////////

export const ZOD_ROOT_ERROR_KEY = 'ZOD_ROOT_ERROR_KEY' // Collision unlikely with field-level paths.

///////////////////////////////////////////////////////////////////////////
//
// In most cases, Zod will short circuit when it encounters an error.
// For example, z.string().min(5) will not return two errors if it's not a string.
//
// However, there are also cases where Zod will return multiple issues.
//
//   const FormSchema = z.object({
//     firstName: z.string()
//       .min(5, 'First name must be at least five characters')
//       .regex(/^[A-Za-z\s'-]+$/, 'First name can only contain letters'), // 👈🏻👈🏻👈🏻 Potential multiple issues.
//
//     address: z.object({
//       city: z.string().min(1, 'A city is required.'),
//       zip: z.string().min(1, 'A zip is required.')
//     }),
//     hobbies: z.array(z.string())
//   })
//
//   const result = FormSchema.safeParse({
//     firstName: '1',
//     address: { city: 'Georgetown', zip: null },
//     hobbies: ['Programming']
//   })
//
//   if (result.success === false) {
//     const formattedZodErrors = formatZodErrors(result.error)
//     console.log('Issues:', result.error.issues)
//     console.log('formattedZodErrors:', formattedZodErrors)
//   } else {
//     console.log('Form is valid!')
//   }
//
// An error that occurred in a nested object will be concatenated
// with dot notation such that [ 'address', 'zip' ] => 'address.zip'.
// Similarly, if an error occurred in an element index 1 of myArray,
// ['myArray', 1] => 'myArray.1'.
//
///////////////////////////////////////////////////////////////////////////

export const formatZodIssues = (issues: readonly Pick<ZodIssueLike, 'path' | 'message'>[]) => {
  // Map (not {}) so keys like 'constructor' or 'toString' can't collide with Object.prototype.
  const errorsMap = new Map<string, string[]>()

  for (const issue of issues) {
    // ⚠️ Gotcha: Previously, all logic inside the for loop here was wrapped in
    // if (issue?.path?.length) { ... }. However, that means that every issue with path: []
    // was skipped, which is what an object-level .refine() produces, so it would result in
    // root-level errors (AKA formErrors) getting skipped. Instead, the ZOD_ROOT_ERROR_KEY
    // is used such that issues with no path are now grouped under this key instead of being dropped.

    // Why .map(String)? This is a small defensive tweak. In Zod 4, path is typed as PropertyKey[],
    // which can technically contain symbols, and join throws a TypeError on a symbol. For normal
    // string and number paths the output is identical.

    const key = issue.path.length ? issue.path.map(String).join('.') : ZOD_ROOT_ERROR_KEY

    const messages = errorsMap.get(key)

    if (messages) {
      messages.push(issue.message)
    } else {
      errorsMap.set(key, [issue.message])
    }
  }

  // Object.fromEntries defines own properties, so odd keys are safe here too.
  return Object.fromEntries(Array.from(errorsMap, ([key, messages]) => [key, messages.join(', ')] as const))
}

/* ======================
getSerializedZodErrors()
====================== */
// This utility is specifically for checking for Zod issues
// that have been serialized into the error.message by
// Tanstack Start from within a server function .validator().
// Use this utility from within a catch block when consuming a
// server function on the client.

export const getSerializedZodErrors = (err: unknown) => {
  if (!(err instanceof Error)) {
    return null
  }

  // Try to parse the message as JSON (it contains the ZodError issues)
  // If it is a normal string, JSON.parse will throw an error.
  if (!isJSON(err.message)) {
    return null
  }

  try {
    const parsedValue = JSON.parse(err.message)

    if (isZodIssues(parsedValue)) {
      const formattedIssues = formatZodIssues(parsedValue)
      return formattedIssues
    }
    return null
  } catch {
    return null
  }
}

/* ======================
    formatZodErrors()
====================== */
///////////////////////////////////////////////////////////////////////////
//
// This function is NOT for deserializing Zod errors.
// This function takes in a ZodError and returns a dictionary object of errors,
// such that each key (path) has value that is string of all errors joined by a comman.
// Neither z.flattenError() nor z.treeifyError() do this. They tranform issues, but you
// would still have to do a lot of work to dig into the transformed result, find each
// particular error, and then check the associated arrays for one or more messages.
// The same is true for the zod-validation-error package. It's fromError(validationResult.error)
// really doesn't do any better. Packages like TanStack Form do this path-to-field mapping internally,
// but that's only useful if you're on the client and dealing specifically with a form.
//
///////////////////////////////////////////////////////////////////////////

export const formatZodErrors = (error: z.ZodError) => {
  const issues = error.issues
  const errors = formatZodIssues(issues)
  return errors
}
