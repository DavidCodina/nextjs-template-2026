import { Suspense } from 'react'
import { connection } from 'next/server'

/* ========================================================================
              
======================================================================== */
// https://nextjs.org/docs/app/api-reference/functions/connection

const Connection = async () => {
  await connection()
  return null
}

export const ForcePPR = () => {
  return (
    <Suspense fallback={null}>
      <Connection />
    </Suspense>
  )
}
