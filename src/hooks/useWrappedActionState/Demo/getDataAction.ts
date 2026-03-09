import { sleep, randomFail } from 'utils'

///////////////////////////////////////////////////////////////////////////
//
// export const sleep = (delay = 1000) => {
//   return new Promise((resolve) => setTimeout(resolve, delay))
// }
//
// export const randomFail = (failureRate: number = 0.5): boolean => {
//   if (typeof failureRate !== 'number' || failureRate > 1 || failureRate < 0) {
//     failureRate = 0.5
//   }
//   return Math.random() < failureRate
// }
//
///////////////////////////////////////////////////////////////////////////

type RequestBody = {
  name: string
}

/* ========================================================================

======================================================================== */

export const getData = async (requestBody?: RequestBody) => {
  await sleep(1000)

  try {
    if (randomFail(0.5)) {
      throw new Error('Internal Server Error')
    }
    return {
      data: { id: 'abc123', name: requestBody?.name || 'John Doe (0)' },
      message: 'success',
      success: true
    }
  } catch (err) {
    return {
      data: null,
      message: err instanceof Error ? err.message : 'Internal Server Error',
      success: false
    }
  }
}

/* ========================================================================

======================================================================== */
///////////////////////////////////////////////////////////////////////////
//
// Gotcha: If you define your action function for useActionState with an optional payload
//
//   payload?: RequestBody
//
// React will treat it as though you did not specify the payload argument at all,
// which leads to the returned action having an inferred type of () => void.
// This is a subtle but important limitation of the useActionState hook’s type
// inference and runtime behavior. The closest you can get to the desired behavior
// is to do this:
//
//   payload: RequestBody | undefined
//
// Which still necessitates manually passing undefined: action(undefined)
//
///////////////////////////////////////////////////////////////////////////

export const getDataAction = async (_prevState: unknown, payload: RequestBody | undefined) => {
  try {
    const result = await getData(payload)

    return result
  } catch (_err) {
    return {
      data: null,
      message: 'Failed',
      success: false
    }
  }
}
