'use client'

import { Button } from '@/components'
import { protectedAction } from './actions'

/* ========================================================================

======================================================================== */

export const ProtectedActionDemo = () => {
  return (
    <Button
      className='mx-auto flex'
      onClick={() => {
        protectedAction()
          .then((res) => {
            if (res.success) {
              console.log(res.data)
            } else {
              console.log('Unable to get data from protectedAction():', res.message)
            }
            return res
          })
          .catch((_err) => {
            console.log('Error!!!')
          })
      }}
    >
      Log Data From protectedAction()
    </Button>
  )
}
