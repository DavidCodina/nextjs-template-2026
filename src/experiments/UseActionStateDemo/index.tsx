'use client'
import { useState, useActionState, useEffect, startTransition } from 'react'
import { getUser, updateUser } from './api'

/* ========================================================================

======================================================================== */

export const UseActionStateDemo = () => {
  const userId = '12345'
  const [user, setUser] = useState<any>(null)
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')

  const [getUserActionState, getUserAction, getUserPending] = useActionState(async () => {
    const { success, data } = await getUser(userId)
    if (success === true && data) {
      setUser(data)
      setFirstName(data.firstName)
      setLastName(data.lastName)
      return { error: '', success: true }
    }
    return { error: 'Unable to get user.', success: false }
  }, null)

  /* ======================

  ====================== */

  const [updateUserActionState, updateUserAction, updateUserPending] = useActionState(async () => {
    const requestData = { firstName, lastName }
    const { success, data, errors } = await updateUser(userId, requestData)

    if (success === true && data) {
      setUser(data)
      setFirstName('')
      setLastName('')
      return { errors: null, success: true }
    }

    return { errors: errors, success: false }
  }, null)

  const updateErrors = updateUserActionState?.errors

  /* ======================
        useEffect()
  ====================== */

  useEffect(() => {
    // ❌ getUserAction()

    startTransition(() => {
      getUserAction()
    })
  }, []) // eslint-disable-line

  /* ======================
        renerForm()
  ====================== */

  const renderForm = () => {
    if (getUserPending) {
      return <div className='mb-6 text-center text-3xl font-black text-sky-500'>Loading...</div>
    }

    if (getUserActionState?.error) {
      return (
        <div className='mx-auto mb-6 flex max-w-[600px] items-center gap-4 rounded-xl border border-red-800 bg-red-100 px-4 py-3 font-bold text-red-700 shadow-[0_3px_10px_rgb(0,0,0,0.2)]'>
          <svg xmlns='http://www.w3.org/2000/svg' width='32' height='32' fill='currentColor' viewBox='0 0 16 16'>
            <path d='M7.938 2.016A.13.13 0 0 1 8.002 2a.13.13 0 0 1 .063.016.15.15 0 0 1 .054.057l6.857 11.667c.036.06.035.124.002.183a.2.2 0 0 1-.054.06.1.1 0 0 1-.066.017H1.146a.1.1 0 0 1-.066-.017.2.2 0 0 1-.054-.06.18.18 0 0 1 .002-.183L7.884 2.073a.15.15 0 0 1 .054-.057m1.044-.45a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767z' />
            <path d='M7.002 12a1 1 0 1 1 2 0 1 1 0 0 1-2 0M7.1 5.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0z' />
          </svg>

          {getUserActionState?.error}

          <button
            className='ml-auto rounded-lg border border-red-800 bg-red-700 px-2 py-1 text-sm text-white'
            onClick={() => {
              // ❌ getUserAction()
              startTransition(() => {
                getUserAction()
              })
            }}
          >
            Try Again
          </button>
        </div>
      )
    }

    return (
      <form
        className='mx-auto mb-6 max-w-[600px] rounded-lg border border-neutral-400 bg-[#fafafa] p-4 shadow'
        noValidate
        onSubmit={(e) => {
          e.preventDefault()
        }}
      >
        <div className='mb-4'>
          <label htmlFor='firstName' className='font-bold text-sky-500'>
            First Name <sup className='text-red-500'>*</sup>
          </label>
          <input
            id='firstName'
            autoCorrect='off'
            autoCapitalize='none'
            spellCheck={false}
            autoComplete='off'
            className={`w-full rounded border border-neutral-400 bg-white px-2 py-1 text-sm outline-none focus:border-[#86b7fe] focus:shadow-[0_0_0_0.25rem_rgba(13,110,253,0.25)]`}
            name='firstName'
            type='text'
            value={firstName}
            onChange={(e) => {
              setFirstName(e.target.value)
            }}
          />

          {updateErrors?.firstName && <div className='text-sm text-red-500'>{updateErrors?.firstName}</div>}
        </div>

        <div className='mb-4'>
          <label htmlFor='lastName' className='font-bold text-sky-500'>
            Last Name <sup className='text-red-500'>*</sup>
          </label>
          <input
            id='lastName'
            autoCorrect='off'
            autoCapitalize='none'
            spellCheck={false}
            autoComplete='off'
            className={`w-full rounded border border-neutral-400 bg-white px-2 py-1 text-sm outline-none focus:border-[#86b7fe] focus:shadow-[0_0_0_0.25rem_rgba(13,110,253,0.25)]`}
            name='lastName'
            type='text'
            value={lastName}
            onChange={(e) => {
              setLastName(e.target.value)
            }}
          />

          {updateErrors?.lastName && <div className='text-sm text-red-500'>{updateErrors?.lastName}</div>}
        </div>

        <button
          disabled={updateUserPending}
          className='block w-full rounded border border-violet-800 bg-violet-600 px-2 py-1 text-sm font-bold text-white transition-transform duration-100 active:scale-[0.98]'
          onClick={() => {
            // ❌  updateUserAction()
            startTransition(() => {
              updateUserAction()
            })
          }}
          type='button'
        >
          {updateUserPending ? 'Submitting...' : 'Submit'}
        </button>
      </form>
    )
  }

  /* ======================
        renderUser()
  ====================== */

  const renderUser = () => {
    if (user) {
      return (
        <pre className='mx-auto max-w-[600px] rounded-lg border border-neutral-400 bg-white p-4 shadow'>
          {JSON.stringify(user, null, 2)}
        </pre>
      )
    }
    return null
  }

  /* ======================
          return
  ====================== */

  return (
    <>
      {renderForm()} {renderUser()}
    </>
  )
}
