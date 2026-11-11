'use client'

import { Fragment, useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'

import { Dropzone } from '../../'
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// import { faTriangleExclamation } from '@fortawesome/free-solid-svg-icons'
import { schema } from './schema'
import type { SubmitErrorHandler, SubmitHandler } from 'react-hook-form'
import type { z } from 'zod'

import type { DropzoneAPI } from '../../'

// import { uploadImage } from './uploadImage'

type FormValues = z.infer<typeof schema>
// type FormValues = Omit<z.infer<typeof schema>, 'files'> & { files: null }

const defaultValues: FormValues = {
  // One could also default to [] and the validation logic would still behave the same.
  // That said, it's best to be consistent with the internal default state of Dropzone,
  // which is that files is null.
  files: null
}

/* ========================================================================
                                UncontrolledDropzoneDemo
======================================================================== */
// This version still uses React Hook Form, but it doesn't implement: value={values.files}
// This means we need some alternative approach to clear the Dropzone after submitting.
// Dropzone exposes api through the apiRef. Currently, api has one method on it: api.clear().
// This can be invoked programmatically at any point, but is most useful in the isSubmitSuccessful useEffect.

export const UncontrolledDropzoneDemo = () => {
  const apiRef = useRef<DropzoneAPI | null>(null)
  const dropZoneRef = useRef<HTMLDivElement | null>(null)
  const [disabled, setDisabled] = useState(false)
  const [showPreviews, setShowPreviews] = useState(true)

  /* ======================
        useForm()
  ====================== */

  const {
    reset,
    handleSubmit,
    getValues,
    setValue,
    // setError,
    // trigger,
    // watch,
    // control,
    // register,
    // unregister,
    formState: {
      errors,
      isValid,
      // isDirty,
      touchedFields,
      isSubmitting,
      isSubmitted,
      isSubmitSuccessful
    }
  } = useForm<FormValues>({
    defaultValues: defaultValues,

    // Do NOT use mode: 'all'. Instead use mode: 'onTouched'.
    // This will validate onBlur. Then will subsequently, validate onChange.
    // It will also validate onSubmit.
    // The reason this is important is because the form field components
    // are designed to ALWAYS SHOW Error if there is an error.
    mode: 'onTouched',
    resolver: zodResolver(schema)
  })

  /* ======================
        onSubmit()
  ====================== */

  const onSubmit: SubmitHandler<FormValues> = /* async */ (data, _e) => {
    toast.success('Form validation success!')
    console.log('onSubmit called.', data)

    // Because of the validation on data.files, we know that there will
    // be an image. However, Typescript doesn't know this.
    const image = data.files?.[0]

    if (!(image instanceof File)) {
      return
    }

    // const result = await uploadImage(image)
    // if (result.success === true) {
    //   toast.success('Image uploaded.')
    // } else {
    //   console.log('uploadImages() response:', result)
    //   toast.error('Unable to upload image.')
    // }
  }

  /* ======================
        onError()
  ====================== */

  const onError: SubmitErrorHandler<FormValues> = (errors, _e) => {
    const values = getValues()
    console.log({ values, errors })
    // toast.error('Please correct form validation errors!')
  }

  /* ======================
        useEffect()
  ====================== */
  // This is the isSubmitSuccessful useEffect.

  useEffect(() => {
    if (isSubmitSuccessful === true) {
      // Manually, clearing the Dropzone is necessary for uncontrolled
      // implementation. Simply resetting RHF is not sufficient.
      apiRef.current?.clear()
      reset(undefined, {})
    }

    // We need isSubmitted as well because isSubmitSuccessful will be false by default.
    else if (isSubmitted && !isSubmitSuccessful) {
      toast.error('Unable to submit the form!')
    }
  }, [isSubmitted, isSubmitSuccessful, reset])

  /* ======================
          return
  ====================== */

  return (
    <>
      <div className='mb-6 flex justify-center gap-4'>
        <button
          onClick={() => {
            setDisabled((v) => !v)
          }}
          className='btn-blue btn-sm'
        >
          disabled: {disabled ? 'true' : 'false'}
        </button>

        <button
          onClick={() => {
            setShowPreviews((v) => !v)
          }}
          className='btn-blue btn-sm'
        >
          showPreviews: {showPreviews ? 'true' : 'false'}
        </button>

        <button
          onClick={() => {
            const api = apiRef.current
            api?.clear()
            // There's no need to do this so long as the onChange is updating values.files.
            // setValue('files', null, { shouldDirty: true, shouldTouch: true, shouldValidate: true })
          }}
          className='btn-blue btn-sm'
        >
          Clear Files
        </button>
      </div>

      <form
        className='mx-auto mb-6 rounded-lg border border-neutral-400 p-4 shadow'
        style={{ backgroundColor: '#fafafa', maxWidth: 800 }}
        onSubmit={(e) => {
          e.preventDefault()
        }}
        noValidate
      >
        {/* For react-hook-form implementations, it might seem reasonable to use Controller.
        However, it isn't all that useful. Why? Because React Dropzone's input <input {...getInputProps() />
        doesn't actually get triggered onChange, onBlur, etc. For this reason, it also doesn't make 
        sense to spread { ...register('files') }. That said, it's still possible to integrate with 
        react-hook-form as follows. Needless to say, there's a lot of logic on the consuming side that 
        is easy to get wrong. */}

        <Dropzone
          labelProps={{
            children: 'Drop A File (Uncontrolled)',
            // className: 'font-bold text-blue-500 text-sm',
            labelRequired: true
          }}
          apiRef={apiRef}
          ref={dropZoneRef}
          error={errors?.files?.message}
          dropzoneOptions={{
            maxFiles: 1,

            // While React Dropzone does expose onDropAccepted, we actually want
            // to use the custom onChange because it hooks into ALL changes to files,
            // NOT just when files are dropped. This means we can also know when files
            // has been reset to null, which would otherwise not be impossible here.
            onDropAccepted: (_files, _event) => {
              // console.log('\nDrop Accepted:', { files, event })
            },

            ///////////////////////////////////////////////////////////////////////////
            //
            // TL;DR: Don't use onDropRejected() to set an error..
            //
            // onDropRejected() is called when react-dropzone's accept, maxFiles, maxSize, etc. are violated.
            // If a file is rejected, it doesn't make sense set an error or touched.
            //
            // Why? Because it was rejected! In other words, it never even made it to the onDrop() -> files.
            // By default, it was simply omitted. The best thing one can do in such cases is to notify the user
            // with a toast.
            //
            // Another reason not to set errors here is that one can potentially run into race conditions against
            //  ny external validation that happens within onChange(). Ultimately, onne should treat external
            // validation (e.g., validateFiles()) as the single source of truth for validity.
            //
            // I would even argue that one should not use maxFiles, maxSize at all. Instead, simply allow the user
            // to select the files, then let the validator do its job. The whole flow of files getting rejected
            // and subsequent toast notifications is not necessary.
            //
            // Finally, if you wanted to hardcode this kind of behavior into the Dropzone abstraction, we
            // could do it from within the onDrop() callback, which also receives fileRejections. Then we
            // could have a custom prop to opt out of rejection notifications.
            //
            ///////////////////////////////////////////////////////////////////////////

            onDropRejected: (fileRejections, _event) => {
              const message = (
                <div>
                  <div className='mb-1'>One or more file rejections occurred:</div>

                  <ul className='list-disc space-y-1'>
                    {fileRejections.map((item, index) => {
                      return (
                        <li key={index}>
                          {item.file.name}: {item.errors[0].message}
                        </li>
                      )
                    })}
                  </ul>
                </div>
              )

              toast.error(message, {
                duration: 1000 * 5
              })
            },

            onFileDialogCancel: () => {
              const values = getValues()
              setValue('files', values.files, {
                shouldValidate: true,
                shouldDirty: true,
                shouldTouch: true
              })
            },

            disabled: disabled,

            accept: {
              'image/jpeg': ['.jpeg', '.jpg'],
              'image/png': ['.png']
              // 'image/gif': ['.gif'],
              // 'image/webp': ['.webp'],
              // 'application/json': ['.json']
            }
          }}
          touched={touchedFields?.files as boolean}
          acceptMessage='PNG and JPG files are allowed.'
          className='[--dropzone-preview-size:50px] [--dropzone-theme-color:--tw-blue-500]'
          style={{}}
          showPreviews={showPreviews}
          groupClassName='mx-auto mb-4 w-full'
          groupStyle={{}}
          id='uncontrolled-dropzone'
          inputId='files'
          inputName='files'
          onBlur={(e) => {
            const currentFocusElement = document.activeElement
            // If new focus element is outside of Dropzone, then call trigger(), or preferably setValue().
            // trigger('files') will work, but we actually want to update touched as well.
            if (!e.target.contains(currentFocusElement)) {
              const values = getValues()
              setValue('files', values.files, {
                shouldValidate: true,
                shouldDirty: true,
                shouldTouch: true
              })
            }
          }}
          onChange={(newValue: any) => {
            setValue('files', newValue, {
              // When the react-hook-form calls reset(undefined, {}), it then triggers the onChange() handler.
              // In order to prevent validation AFTER reset, we need to specify to ONLY validate if filesTouched.
              shouldValidate: touchedFields.files ? true : false,
              shouldDirty: true,
              shouldTouch: true
            })
          }}
        />

        {/* =====================
           Submit Button
      ===================== */}

        {isSubmitting ? (
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
            onClick={handleSubmit(onSubmit, onError)}
            type='button'
          >
            {isSubmitted && !isValid ? (
              <Fragment>
                {/* <FontAwesomeIcon
                  icon={faTriangleExclamation}
                  style={{ marginRight: 5 }}
                /> */}
                Please Fix Errors...
              </Fragment>
            ) : (
              'Submit'
            )}
          </button>
        )}
      </form>
    </>
  )
}
