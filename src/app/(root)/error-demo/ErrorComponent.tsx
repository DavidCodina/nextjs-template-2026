'use client'

import * as React from 'react'
import { Button } from '@/components'

/* ========================================================================
              
======================================================================== */

export const ErrorComponent = () => {
  const [items, setItems] = React.useState<any>([])

  /* ======================
          return
  ====================== */

  return (
    <>
      <Button
        className='mx-auto flex'
        onClick={() => {
          setItems(undefined)
        }}
        size='sm'
        variant='destructive'
      >
        Break The Page!
      </Button>

      {items.map(() => null)}
    </>
  )
}
