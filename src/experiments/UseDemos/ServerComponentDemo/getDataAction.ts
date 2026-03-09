'use server'

import { sleep } from '@/utils'

export const getDataAction = async () => {
  await sleep(2000)

  return {
    data: { id: '1', name: 'David' },
    message: 'success',
    success: true
  }
}
