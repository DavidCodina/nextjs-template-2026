'use client'

import * as React from 'react'
import { toast } from 'sonner'
import { Dropzone } from '../../'

import type { DropzoneAPI } from '../../'
import { Button } from '@/components'
import { sleep } from '@/utils'

/* ========================================================================

======================================================================== */
// This version doesn't implement: value={files}
// This means we need some alternative approach to clear the Dropzone after submitting.
// Dropzone exposes api through the apiRef. Currently, api has one method on it: api.clear().

export const UncontrolledDropzoneDemo = () => {
  const dropZoneRef = React.useRef<HTMLDivElement | null>(null)
  const apiRef = React.useRef<DropzoneAPI | null>(null)

  const [files, setFiles] = React.useState<File[] | null>(null)
  const [filesTouched, setFilesTouched] = React.useState(false)
  const [filesError, setFilesError] = React.useState('')

  const [disabled, setDisabled] = React.useState(false)
  const [showPreviews, setShowPreviews] = React.useState(true)
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  // Derived state
  const isErrors = filesError !== ''
  const allTouched = filesTouched

  /* ======================
      validateFiles()
  ====================== */

  const validateFiles = (value?: File[] | null) => {
    value = typeof value !== 'undefined' ? value : files
    // console.log('validateFiles() called:', {
    //   value,
    //   isArray: Array.isArray(value)
    // })
    let error = ''
    const validType = value === null || Array.isArray(value)
    if (!validType) {
      error = 'Invalid type'
      setFilesError(error)
      return error
    }

    if (!value || (Array.isArray(value) && value.length === 0)) {
      error = 'Required'
      setFilesError(error)
      return error
    }

    if (Array.isArray(value) && value.length > 1) {
      error = 'Only one file is allowed'
      setFilesError(error)
      return error
    }

    // This is extremely unlikely and arguably "defensive noise".
    // However such a check would be appropriate on the server.
    const allFiles = value.every((item) => item instanceof File)
    if (!allFiles) {
      error = 'One or more items are not a file'
      setFilesError(error)
      return error
    }
    // Also validate for file type, size, etc.
    // Don't rely on on onDropRejected().
    // Otherwise unset the password error in state and return ''

    setFilesError('')
    return ''
  }

  /* ======================
        validate()
  ====================== */

  const validate = () => {
    const errors: string[] = []

    // Set true on all toucher functions.
    const touchers: React.Dispatch<React.SetStateAction<boolean>>[] = [setFilesTouched]

    touchers.forEach((toucher) => {
      toucher(true)
    })

    const validators: (() => string)[] = [validateFiles]

    validators.forEach((validator) => {
      const error = validator()
      if (error) {
        errors.push(error)
      }
    })

    // Return early if errors
    if (errors.length >= 1) {
      toast.error('Form validation errors found.')
      return { isValid: false, errors: errors }
    }

    return { isValid: true, errors: null }
  }

  /* ======================
        handleSubmit()
  ====================== */

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    if (!validate().isValid) return

    setIsSubmitting(true)

    try {
      await sleep(1000)
      toast.success('Form validation success!')
    } catch (_err) {
      toast.error('Unable to submit the form!')
    } finally {
      setIsSubmitting(false)
    }
  }

  // const onSubmit: SubmitHandler<FormValues> = async (data, _e) => {
  //   // toast.success('Form validation success!')
  //   // console.log('onSubmit called.', data)

  //   // Because of the validation on data.files, we know that there will
  //   // be an image. However, Typescript doesn't know this.
  //   const image = data.files?.[0]

  //   if (!(image instanceof File)) {
  //     return
  //   }

  //   const result = await uploadImage(image)

  //   if (result.success === true) {
  //     toast.success('Image uploaded.')
  //   } else {
  //     console.log('uploadImages() response:', result)
  //     toast.error('Unable to upload image.')
  //   }
  // }

  /* ======================
      renderControls()
  ====================== */

  const renderControls = () => {
    return (
      <div className='mb-6 flex justify-center gap-4'>
        <Button
          className='min-w-[150px]'
          onClick={() => {
            setDisabled((v) => !v)
          }}
          size='sm'
        >
          disabled: {disabled ? 'true' : 'false'}
        </Button>

        <Button
          className='min-w-[150px]'
          onClick={() => {
            setShowPreviews((v) => !v)
          }}
          size='sm'
        >
          Previews: {showPreviews ? 'true' : 'false'}
        </Button>

        <Button
          className='min-w-[150px]'
          onClick={() => {
            apiRef.current?.clear()

            ///////////////////////////////////////////////////////////////////////////
            //
            // There's no need to call validateFiles(), or setFiles(null) on any external state.
            // Why not? Because calling apiRef.current?.clear() will call setFiles(null), internally,
            // which then triggers a useEffect() that fires onChange?.(files):
            //
            //   useEffect(() => {
            //     if (hasChangedRef.current === false) return
            //     onChange?.(files)
            //   }, [files])
            //
            // So as long as the onChange is updating file state and calling a validator here in the consuming
            // component, we'red good.
            //
            ///////////////////////////////////////////////////////////////////////////

            setFilesTouched(true)
          }}
          size='sm'
        >
          Clear Files
        </Button>

        <Button
          className='min-w-[150px]'
          onClick={() => {
            ///////////////////////////////////////////////////////////////////////////
            //
            // Suppose we want to reset the Dropzone without triggering the onChange() validation.
            // Even if you call setFilesError('') here, the onChange() happens later, so we've got a problem.
            // Fortunately, we can setFilesTouched(false), which at least in this case prevents onChange() from
            // validating. Also, calling setFilesError('') from within a setTimeout creates a macrotask, so
            // even without setFilesTouched(false), the wrapped setFilesError would have the last say.
            //
            ///////////////////////////////////////////////////////////////////////////
            apiRef.current?.clear()
            setFilesTouched(false)

            setTimeout(() => {
              setFilesError('')
            }, 0)
          }}
          size='sm'
        >
          Reset Dropzone
        </Button>
      </div>
    )
  }

  /* ======================
          return
  ====================== */

  return (
    <>
      {renderControls()}

      <form
        className='bg-card mx-auto mb-6 max-w-[800px] rounded-lg border p-6 shadow'
        onSubmit={(e) => {
          e.preventDefault()
        }}
        noValidate
      >
        <Dropzone
          ref={dropZoneRef}
          apiRef={apiRef}
          error={filesError}
          touched={filesTouched}
          labelProps={{
            children: 'Drop A File (Uncontrolled)',
            // className: 'font-bold text-blue-500 text-sm',
            labelRequired: true
          }}
          dropzoneOptions={{
            // ⚠️ Gotcha: react-dropzone's internal validation uses maxFiles to run onDropRejected()
            // against any given drop or file selection. However, this does not prevent someone from
            // dropping/selecitng multiple files if done one at a time. Why? Because currently our
            // internal onDrop() logic is set up to be cumulative. Thus, while this could prevent
            // multiple simultaneious files from being dropped, one should not use this as a reliable
            // means of validation, and instead rely on an external validation function.
            maxFiles: 1,

            ///////////////////////////////////////////////////////////////////////////
            //
            // Note: By default, Next.js has a 1MB bodySizeLimit.
            //
            //   bodySizeLimit: https://nextjs.org/docs/app/api-reference/config/next-config-js/serverActions#bodysizelimit
            //
            //   By default, the maximum size of the request body sent to a Server Action is 1MB, to prevent
            //   the consumption of excessive server resources in parsing large amounts of data, as well as
            //   potential DDoS attacks.
            //
            //   However, you can configure this limit using the serverActions.bodySizeLimit option. It can take
            //   the number of bytes or any string format supported by bytes, for example 1000, '500kb' or '3mb'.
            //
            ///////////////////////////////////////////////////////////////////////////
            // maxSize: 300000, // arbitrary value for testing.

            accept: {
              'image/jpeg': ['.jpeg', '.jpg'],
              'image/png': ['.png']
              // 'image/gif': ['.gif'],
              // 'image/webp': ['.webp'],
              // 'application/json': ['.json']
            },

            ///////////////////////////////////////////////////////////////////////////
            //
            // While React Dropzone does expose onDropAccepted, we generally want
            // to use the custom onChange because it hooks into ALL changes to files,
            // NOT just when files are dropped. This means we can also know when files
            // has been reset to null, which would otherwise not be impossible here.
            //
            // Note: Dropping an item wil not trigger a focus event on the Dropzone. Thus, it
            // makes sense to call setFilesTouched(true) here as well.
            //
            ///////////////////////////////////////////////////////////////////////////
            onDropAccepted: (_files, _event) => {
              setFilesTouched(true)
              // console.log('\nDrop Accepted:', { _files, _event })
            },

            ///////////////////////////////////////////////////////////////////////////
            //
            // TL;DR: Don't use onDropRejected() to call setFilesError().
            //
            // onDropRejected() is called when react-dropzone's accept, maxFiles, maxSize, etc. are violated.
            // If a file is rejected, it doesn't make sense to do this:
            //
            //   setFilesError( ... )
            //   setFilesTouched(true)
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

            ///////////////////////////////////////////////////////////////////////////
            //
            // https://github.com/react-dropzone/react-dropzone?tab=readme-ov-file#file-dialog-cancel-callback
            // Note: The onFileDialogCancel() cb is unstable in most browsers, meaning, there's a good chance
            // of it being triggered even though you have selected files. This can be mitigated by opting into
            // the File System Access API.
            //
            //   useFsAccessApi: true
            //
            // However, legacy browsers may still fall back to the legacy approach,
            // which could potentially lead to unexpected behavior. In practice, this means you may want to
            // completely avoid the use of the onFileDialogCancel() callback.
            //
            ///////////////////////////////////////////////////////////////////////////
            onFileDialogCancel: () => {
              // console.log('onFileDialogCancel() called.')
              validateFiles()
              setFilesTouched(true)
            },

            disabled: disabled
          }}
          acceptMessage='PNG and JPG files are allowed.'
          className='[--dropzone-preview-size:150px] [--dropzone-theme-color:var(--color-sky-500)]'
          style={{}}
          showPreviews={showPreviews}
          groupClassName='mx-auto mb-4 w-full'
          groupStyle={{}}
          id='my-dropzone'
          inputId='files'
          inputName='files' // ⚠️ Likely very important for Tanstack Form.
          onBlur={(e) => {
            const currentFocusElement = document.activeElement

            if (!e.target.contains(currentFocusElement)) {
              // console.log('onBlur() called.')
              validateFiles()
              setFilesTouched(true)
            }
          }}
          onChange={(newValue: File[] | null) => {
            console.log('onChange() called:', {
              newValue,
              type: typeof newValue,
              isArray: Array.isArray(newValue),
              filesTouched
            })

            setFiles(newValue)

            if (filesTouched) {
              validateFiles(newValue)
            }
          }}
          // ❌ value={files} ❌
        />

        {/* =====================
              Submit Button
        ===================== */}

        {allTouched && isErrors ? (
          <Button
            className='flex w-full'
            disabled={allTouched && isErrors ? true : false}
            size='sm'
            type='button'
            variant='success'
          >
            Please Fix Errors...
          </Button>
        ) : (
          <Button
            className='flex w-full'
            loading={isSubmitting}
            onClick={handleSubmit}
            size='sm'
            type='button'
            variant='success'
          >
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </Button>
        )}
      </form>
    </>
  )
}
