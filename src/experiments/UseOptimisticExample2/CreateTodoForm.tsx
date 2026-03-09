'use client'

import { useState, useEffect, useRef } from 'react'
import { FormValues } from './types'

type Props = {
  status: 'idle' | 'pending' | 'success' | 'error'
  onSubmitAction: (formValues: FormValues) => void
}

/* ========================================================================
                              CreateTodoForm()
======================================================================== */

export const CreateTodoForm = ({ onSubmitAction, status }: Props) => {
  const firstRenderRef = useRef(true)
  const [title, setTitle] = useState('Learn Python')
  const [description, setDescription] = useState('Bla, bla, bla...')

  /* ======================
        useEffec()
  ====================== */

  useEffect(() => {
    if (firstRenderRef.current === true) {
      // Queue macrotask to skip both initial-mount invocations in strict mode.
      setTimeout(() => {
        firstRenderRef.current = false
      }, 0)

      return
    }

    if (status === 'idle') {
      setTitle('')
      setDescription('')
    }
  }, [status])

  /* ======================
           return
  ====================== */

  // In this case, the onSubmitAction is receiving a value directly from
  // our state, rather than using the FormData passed into the action attribute.
  // In order to maintain the correct behavior, actionWrapper needs to be async,
  // and await the true onSubmitAction.
  const actionWrapper = async () => {
    //# Validation...
    await onSubmitAction({ title, description })
  }

  return (
    <form
      action={actionWrapper} // eslint-disable-line
      className='mx-auto mb-6 rounded-lg border border-neutral-400 p-4 shadow'
      style={{ backgroundColor: '#fafafa', maxWidth: 600 }}
      noValidate
    >
      <div className='mb-4'>
        <label htmlFor='title' className='font-bold text-blue-500'>
          Title
        </label>
        <input
          autoCorrect='off'
          autoCapitalize='none'
          spellCheck={false}
          autoComplete='off'
          className='form-control form-control-sm'
          name='title'
          type='text'
          value={title}
          onChange={(e) => {
            setTitle(e.target.value)
          }}
        />
      </div>

      <div className='mb-4'>
        <label htmlFor='description' className='font-bold text-blue-500'>
          Description
        </label>
        <textarea
          autoCorrect='off'
          autoCapitalize='none'
          spellCheck={false}
          autoComplete='off'
          className='form-control form-control-sm'
          name='description'
          value={description}
          onChange={(e) => {
            setDescription(e.target.value)
          }}
        />
      </div>

      <button disabled={status === 'pending'} className='btn-green btn-sm block w-full'>
        {status === 'pending' ? 'Submitting...' : 'Submit'}
      </button>
    </form>
  )
}
