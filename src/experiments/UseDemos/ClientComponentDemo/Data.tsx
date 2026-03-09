'use client'

import { useState, useEffect } from 'react'

/* ========================================================================
                                  Data                       
======================================================================== */

export const Data = ({ url }: { url: string }) => {
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<any>(null)

  /* ======================
        useEffect()
  ====================== */

  useEffect(() => {
    setError('')
    setLoading(true)
    setData(null)

    fetch(url)
      .then((res) => res.json())
      .then(setData)
      .catch((err) => {
        if (err instanceof Error) {
          setError(err.message)
        } else {
          setError('Error: Unable to get data!')
        }
      })
      .finally(() => setLoading(false))
  }, [url])

  /* ======================
        renderData()
  ====================== */

  const renderData = () => {
    if (error) {
      return <h3 className='p-6 text-center font-bold text-red-500'>Error!</h3>
    }

    if (loading) {
      return <h3 className='my-6 text-center font-black text-blue-500'>Loading...</h3>
    }

    if (data) {
      return <pre>{JSON.stringify(data, null, 2)}</pre>
    }

    return null
  }

  /* ======================
          return
  ====================== */

  return renderData()
}
