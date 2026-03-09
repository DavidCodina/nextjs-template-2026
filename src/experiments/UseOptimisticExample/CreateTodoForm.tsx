'use client'

import { useEffect, useRef } from 'react'
import { useForm, SubmitHandler, SubmitErrorHandler } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
// import { toast } from 'react-toastify'

import { AlertCircle } from 'lucide-react'

type Props = {
  defaultValues?: { title?: string; description?: string }
  transitionPending: boolean
  onSubmit: (formValues: FormValues) => void
}

const schema = z.object({
  title: z.string().min(1, 'Required.'),
  description: z.string() // .min(1, 'Required.')
})

export type FormValues = z.infer<typeof schema>

/* ========================================================================
                              CreateTodoForm()
======================================================================== */

export const CreateTodoForm = ({ defaultValues, onSubmit, transitionPending }: Props) => {
  const firstRenderRef = useRef(true)

  const formDefaults: FormValues = {
    title: defaultValues?.title || '',
    description: defaultValues?.description || ''
  }

  const {
    register,
    reset,
    handleSubmit,
    // getValues,
    // trigger,
    // watch,
    formState: { errors, isValid, touchedFields, isSubmitting, isSubmitted, isSubmitSuccessful }
  } = useForm<FormValues>({
    defaultValues: formDefaults,
    mode: 'onTouched',
    resolver: zodResolver(schema)
  })

  /* ======================
          getClassName()
    ====================== */

  const getClassName = ({
    className,
    error,
    size,
    touched
  }: {
    className: string
    error: string | undefined
    size?: 'sm' | 'lg'
    touched: boolean | undefined
  }) => {
    let classes = 'form-control'

    if (error) {
      classes = `${classes} is-invalid`
    } else if (!error && touched) {
      classes = `${classes} is-valid`
    }

    if (size === 'sm') {
      classes = `${classes} form-control-sm`
    } else if (size === 'lg') {
      classes = `${classes} form-control-lg`
    }

    if (className) {
      classes = `${classes} ${className}`
    }

    return classes
  }

  /* ======================
      onSubmitSuccess()
  ====================== */

  const onSubmitSuccess: SubmitHandler<FormValues> = /* async */ (data, _e) => {
    // When onSubmit is a normal async function, then awaiting onSubmit
    // will cause RHF's isSubmitting to be true during that time. However,
    // when you're implementing useOptimistic in conjunction with startTransition,
    // startTransition returns void so, the await will not do anything.
    onSubmit({ title: data.title, description: data.description })
  }

  /* ======================
        onSubmitFail()
  ====================== */

  const onSubmitFail: SubmitErrorHandler<FormValues> = (_errors, _e) => {
    // const values = getValues()
    // console.log({ values, errors })
    // toast.error('Please correct form validation errors!')
  }

  /* ======================
        useEffec()
  ====================== */

  ///////////////////////////////////////////////////////////////////////////
  //
  // What is the point of React strict mode? It wants to make sure that any effect
  // that is not properly cleaned up is brought to our attention. However well-intentioned,
  // it also can be problematic to work around.
  //
  // That means that on-mount the useEffect will run twice.
  // However, I DO NOT want the useEffect to run on mount.
  // For that reason I've implemented a firstRenderRef.
  // Without the setTimeout wrapper the firstRenderRef would opt out of the first useEfffect invocation,
  // but because React strict mode runs the useEffect twice it would not opt out of the second invocation.
  // In order to mitigate this, the `firstRenderRef.current = false` is wrapped in a setTimeout.
  // This results in it being allocated to a new macrotask, which is essentially pushed to the bottom of the call stack.
  // This allows BOTH useEffect invocations to run before I finally set firstRenderRef.current to false.
  //
  // Note: In this particular use case, we could also do this:
  //
  //   useEffect(() => {
  //     return () => {
  //       if (transitionPending === true) { reset({ title: '', description: '' }, {}) }
  //     }
  //     // eslint-disable-next-line
  //   }, [transitionPending])
  //
  ///////////////////////////////////////////////////////////////////////////

  useEffect(() => {
    if (firstRenderRef.current === true) {
      // Push operation to the end of the current call stack and schedule it as a new macrotask.
      // This is a workaround to mitigate React strict mode's double on-mount invocation.
      setTimeout(() => {
        firstRenderRef.current = false
      }, 0)

      return
    }

    if (transitionPending === false) {
      // Here we are not resetting the form until after the transition completes.
      // If you want to reset the form immediately after RHF succeeds, then do it
      // from the isSubmitSuccessful useEffect() below.
      // Naive approach that assumes no defaults: reset(undefined, {})
      reset({ title: '', description: '' }, {})
    }

    // eslint-disable-next-line
  }, [transitionPending])

  /* ======================
        useEffect()
  ====================== */
  // It's recommended to NOT call reset() from within the onSubmit() function.
  // This will only run when RHF onSubmit/onError has completed.

  useEffect(() => {
    if (isSubmitSuccessful === true) {
      // reset(undefined, {})
      // toast.success('Form validation success!')
    }

    // We need isSubmitted as well because isSubmitSuccessful will be false by default.
    else if (isSubmitted && !isSubmitSuccessful) {
      // toast.error('Unable to submit the form!')
    }
  }, [isSubmitted, isSubmitSuccessful, reset])

  /* ======================
          renderError()
    ====================== */

  const renderError = (error?: string) => {
    if (error) {
      return <div className='invalid-feedback block'>{error}</div>
    }
    return null
  }

  /* ======================
           return
  ====================== */

  return (
    <form
      className='mx-auto mb-6 rounded-lg border border-neutral-400 p-4 shadow'
      style={{ backgroundColor: '#fafafa', maxWidth: 600 }}
      onSubmit={(e) => {
        e.preventDefault()
      }}
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
          className={getClassName({
            className: '',
            error: errors?.title?.message,
            size: 'sm',
            touched: touchedFields.title
          })}
          type='text'
          {...register('title', {
            // disabled: true
          })}
        />

        {renderError(errors?.title?.message)}
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
          className={getClassName({
            className: '',
            error: errors?.description?.message,
            size: 'sm',
            touched: touchedFields.description
          })}
          {...register('description', {
            // disabled: true
          })}
        />

        {renderError(errors?.description?.message)}
      </div>

      {/* =====================
            Submit Button
      ===================== */}

      {isSubmitting || transitionPending ? (
        <button className='btn-green btn-sm block w-full' disabled type='button'>
          <span aria-hidden='true' className='spinner-border spinner-border-sm mr-2' role='status'></span>
          Submitting...
        </button>
      ) : (
        <button
          className='btn-green btn-sm block w-full'
          // You could also add || !isDirty. In the case of an update form,
          // it still makes sense because there's no need to send an update if
          // nothing's actually been updated.
          disabled={isSubmitted && !isValid ? true : false}
          onClick={handleSubmit(onSubmitSuccess, onSubmitFail)}
          type='button'
        >
          {isSubmitted && !isValid ? (
            <>
              <AlertCircle className='mr-2 size-4' />
              Please Fix Errors...
            </>
          ) : (
            'Submit'
          )}
        </button>
      )}
    </form>
  )
}
