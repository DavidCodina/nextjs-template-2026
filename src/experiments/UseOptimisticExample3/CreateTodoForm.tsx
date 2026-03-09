'use client'

import { useEffect, useRef } from 'react'

type DefaultValues = { title?: string; description?: string }

type Props = {
  defaultValues?: DefaultValues
  isPending: boolean
  onSubmitAction: (formData: FormData) => void
}

/* ========================================================================
                              CreateTodoForm()
======================================================================== */

export const CreateTodoForm = ({ defaultValues, onSubmitAction, isPending = false }: Props) => {
  const firstRenderRef = useRef(true)
  const formRef = useRef<HTMLFormElement | null>(null)

  /* ======================
        useEffec()
  ====================== */

  useEffect(() => {
    // Queue Macro Task
    if (firstRenderRef.current === true) {
      setTimeout(() => {
        firstRenderRef.current = false
      }, 0)

      return
    }

    if (isPending === false) {
      // ❌ formRef.current?.reset()
      const inputTitle = formRef.current?.elements.namedItem('title') as HTMLInputElement
      if (inputTitle) {
        inputTitle.value = ''
      }

      const textarea = formRef.current?.elements.namedItem('description') as HTMLTextAreaElement
      if (textarea) {
        textarea.value = ''
      }
    }
  }, [isPending])

  /* ======================
           return
  ====================== */

  return (
    <form
      ref={formRef}
      // eslint-disable-next-line
      action={async (formData) => {
        //# Handle validation, etc.
        await onSubmitAction(formData)
      }}
      className='mx-auto mb-6 rounded-lg border border-neutral-400 p-4 shadow'
      style={{ backgroundColor: '#fafafa', maxWidth: 600 }}
      noValidate
    >
      <div className='mb-4'>
        <label htmlFor='title' className='font-bold text-blue-500'>
          Title
        </label>
        <input
          autoCapitalize='none'
          autoComplete='off'
          autoCorrect='off'
          className='form-control form-control-sm'
          defaultValue={defaultValues?.title || ''}
          name='title'
          spellCheck={false}
          type='text'
        />
      </div>

      <div className='mb-4'>
        <label htmlFor='description' className='font-bold text-blue-500'>
          Description
        </label>
        <textarea
          autoCapitalize='none'
          autoComplete='off'
          autoCorrect='off'
          className='form-control form-control-sm'
          defaultValue={defaultValues?.description || ''}
          name='description'
          spellCheck={false}
        />
      </div>

      <button disabled={isPending} className='btn-green btn-sm block w-full'>
        {isPending ? 'Submitting...' : 'Submit'}
      </button>
    </form>
  )
}
