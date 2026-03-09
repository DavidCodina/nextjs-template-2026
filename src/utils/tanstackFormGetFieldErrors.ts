// Todo: import type { AnyFieldLikeMeta } from '@tanstack/react-form-start'

// Todo: type FieldErrors = AnyFieldLikeMeta['errors']

/* ========================================================================

======================================================================== */
///////////////////////////////////////////////////////////////////////////
//
// Used within form.Subscribe to derive an object of field-level errors
//  from state.fieldMeta.
//
//   <form.Subscribe
//     selector={(state) => {
//       const fieldErrors = tanstackFormGetFieldErrors(state.fieldMeta)
//
//       return {
//         canSubmit: state.canSubmit,
//         isSubmitting: state.isSubmitting,
//         isFieldsValidating: state.isFieldsValidating,
//         formErrors: state.errors,
//         fieldErrors: fieldErrors,
//         isFieldErrors: !state.isFieldsValid
//       }
//     }}
//   > ... </form.Subscribe>
//
// Or can also use in conjunction with useSelector:
//
//   const errors = useSelector(form.store, (state) => tanstackFormGetFieldErrors(state.fieldMeta))
//   console.log('errors', errors)
//
///////////////////////////////////////////////////////////////////////////

// export const tanstackFormGetFieldErrors = (formStateFieldMeta: Partial<Record<string, AnyFieldLikeMeta>>) => {
//   const allFieldErrors: Record<string, FieldErrors> = {}

//   Object.keys(formStateFieldMeta).forEach((fieldName) => {
//     const fieldMeta = formStateFieldMeta[fieldName]

//     if (
//       fieldMeta &&
//       typeof fieldMeta === 'object' &&
//       'errors' in fieldMeta &&
//       Array.isArray(fieldMeta.errors) &&
//       fieldMeta.errors.length > 0
//     ) {
//       allFieldErrors[fieldName] = fieldMeta.errors
//     }
//   })

//   const fieldErrors = Object.fromEntries(
//     Object.entries(allFieldErrors).map(([key, arr]) => [key, arr.map((e) => e.message)])
//   )

//   return fieldErrors
// }

export {}
