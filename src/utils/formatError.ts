/* ======================

====================== */

//! Brad uses eslint-disable-next-line
//! He said that if we don't do this, then when we deploy to Vercel,
//! it will throw its own error. Not sure why that would be the case.
export function formatError(error: any) {
  if (error.name === 'ZodError') {
    // Handle Zod error
    const fieldErrors = Object.keys(error.errors).map((field) => error.errors[field].message)

    return fieldErrors.join('. ')
  } else if (error.name === 'PrismaClientKnownRequestError' && error.code === 'P2002') {
    // Handle Prisma error
    const field = error.meta?.target ? error.meta.target[0] : 'Field'
    return `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`
  } else {
    // Handle other errors
    return typeof error.message === 'string' ? error.message : JSON.stringify(error.message)
  }
}
