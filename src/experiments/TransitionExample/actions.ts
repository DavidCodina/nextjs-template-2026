'use server'

import { sleep } from 'utils'

/* ======================

====================== */

type GetDataResponse = {
  data: Record<string, any> | null
  message: string
  success: boolean
}

export const getData = async (): Promise<GetDataResponse> => {
  try {
    await sleep(5000)

    return {
      data: { secret: 'abc123' },
      message: 'Success.',
      success: true
    }
  } catch (err) {
    if (process.env.NODE_ENV === 'development') {
      console.log(err)
    }
    return {
      data: null,
      message: 'Server error.',
      success: false
    }
  }
}
