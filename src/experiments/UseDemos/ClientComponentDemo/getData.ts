import { sleep, randomFail } from 'utils'
import { ResponsePromise } from '@/types'

type Data = unknown // Or be more specific.
export type GetDataResponsePromise = ResponsePromise<Data>
export type GetData = (url: string) => GetDataResponsePromise
export type GetDataResolvedResponse = Awaited<GetDataResponsePromise>

/* ========================================================================

======================================================================== */

export const getData: GetData = async (url: string) => {
  if (!url || typeof url !== 'string') {
    return {
      data: null,
      message: 'There was no url.',
      success: false
    }
  }

  try {
    await sleep(1000)

    if (randomFail(0.25)) {
      throw new Error('Whoops! Something went wrong!')
    }

    const res = await fetch(url)
    const json = await res.json()

    return {
      data: json,
      message: 'Request success.',
      success: true
    }
  } catch (_err) {
    return {
      data: null,
      message: 'Request failed.',
      success: false
    }
  }
}
