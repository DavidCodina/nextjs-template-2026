'use client'

import React, { useCallback, useEffect, useId, useRef, useState } from 'react'
import {
  useDropzone
  // DropzoneOptions
  // FileRejection,
  // DropEvent
} from 'react-dropzone'
import { deepEqual, setFilePreviews } from '../utils'

import { Paragraph1 } from './Paragraph1'
import { Paragraph2 } from './Paragraph2'
import { Previews } from './Previews'
import { DeleteButton } from './DeleteButton'
// import { DataTest } from './DataTest'

import type { DropzoneBaseProps, InternalRef, OnDrop, PreviewObject } from '../types'

import { cn, isFileArray } from '@/utils'

//# Deduplicate this.
type DropzoneAPI = {
  clear: () => void
}

type InternalDropzoneBaseProps = {
  internalRef: InternalRef
}

const baseClasses = `
[--dropzone-default-theme-color:var(--color-primary)]
[--dropzone-preview-size:100px]
relative flex flex-col justify-center items-center
w-full p-6 bg-card 
border-2 border-dashed rounded-xl
outline-none
cursor-pointer
focus:border-primary
focus:ring-[3px]
focus:ring-primary/50
`

const svgClasses = `
 text-(--dropzone-theme-color,var(--dropzone-default-theme-color))
`

/* ========================================================================

======================================================================== */
// https://react-dropzone.js.org/

export const DropzoneBase = ({
  acceptMessage,
  apiRef,
  className = '',
  disabled = false,
  dropzoneOptions = {},
  error = '',
  id,
  inputId,
  inputName,
  internalRef,
  style = {},
  onBlur,
  onChange,
  ref,
  showPreviews = true,
  touched = false,
  value = null,
  ...otherProps
}: DropzoneBaseProps & InternalDropzoneBaseProps) => {
  /* ======================
          constants 
  ====================== */

  const dropzoneId = useId()
  id = id || dropzoneId

  ///////////////////////////////////////////////////////////////////////////
  //
  // This is now done in Dropzone.tsx, so it can also be passed to DropzoneLabel:
  //
  //   const fileInputId = useId()
  //   inputId = inputId || fileInputId
  //
  ///////////////////////////////////////////////////////////////////////////

  const isInvalid = !!error
  const isValid = !error && touched

  /* ======================
        state & refs 
  ====================== */

  // hasChangedRef is used to prevent onChange from firing on mount or
  // immediately after mount within the associated useEffect() below.
  const hasChangedRef = useRef(false)

  const [files, setFiles] = useState<File[] | null>(() => {
    return value || null
  })
  const [previews, setPreviews] = useState<PreviewObject[] | null>(null)

  // Derived state
  const fileNames: string[] | null = (() => {
    if (Array.isArray(files) && files.length > 0) {
      const names = files.map((file) => {
        const { name } = file
        return name
      })
      return names
    }
    return null
  })()

  /* ======================
          onDrop() 
  ====================== */
  // onDrop?: (<T extends File>(acceptedFiles: T[], fileRejections: FileRejection[], event: DropEvent) => void) | undefined
  // The basic idea here is that we update files state with acceptedFiles.

  const onDrop = useCallback<OnDrop>(
    (
      acceptedFiles, //   File[],
      _fileRejections, // FileRejection[],
      _event //           DropEvent
    ) => {
      ///////////////////////////////////////////////////////////////////////////
      //
      // A file will be rejected if it does not match the options specified in
      // options.accept options.maxSize, etc. One could have onFileRejection()
      // prop that gets triggered here whenever there are file rejections.
      // However, there's already options.onDropRejected().
      //
      // Note: Suppose you drop a single file and it gets rejected. In that case,
      // acceptedFiles will be: []. This is what James Q Quick discussed in this
      // tutorial: https://www.youtube.com/watch?v=SBL3dhKs21o
      //
      // To mitigate this gotcha here, we make sure to check if it's an array AND
      // that it has length greater than 0, and of course it doesn't hurt to double-check
      // that all elements within the array are actually of type File.
      //
      ///////////////////////////////////////////////////////////////////////////

      if (Array.isArray(acceptedFiles) && acceptedFiles.length > 0 && isFileArray(acceptedFiles)) {
        // hasChangedRef.current is checked in the useEffect() below that calls
        // onChange?.(files) whenever files changes.
        if (hasChangedRef.current === false) {
          hasChangedRef.current = true
        }

        ///////////////////////////////////////////////////////////////////////////
        //
        // Initially, this was done: setFiles(acceptedFiles)
        // However, Hamed Bahram at 7:00 of https://www.youtube.com/watch?v=eGVC8UUqCBE
        // Creates logic to cumulatively add files.
        //
        //   setFiles((prevFiles) => {
        //     prevFiles = prevFiles || []
        //     return [...prevFiles, ...acceptedFiles]
        //   })
        //
        // Either solution works, but with the cumulative approach, we probably also
        // want to deduplicates files as follows.
        //
        // Additionally, it's important to understand that dropzoneOptions.maxFiles
        // only applies to a single drop, which means that an end user can get around
        // onDropRejected() by dropping selecting/dropping multiple files, one at a time.
        // Ultimately, this means that one should not rely solely on maxFiles as a source
        // of validation, and should also use external validation logic.
        //
        ///////////////////////////////////////////////////////////////////////////

        setFiles((prevFiles) => {
          prevFiles = prevFiles || []
          const existingKeys = new Set(
            // If you want to allow for dulicate file names, but deduplicate
            // exact duplicates the you can do something like this instead:
            // prevFiles.map((f) => `${f.name}-${f.size}-${f.lastModified}`)
            prevFiles.map((f) => `${f.name}`)
          )
          const uniqueNewFiles = acceptedFiles.filter(
            // (f) => !existingKeys.has(`${f.name}-${f.size}-${f.lastModified}`)
            (f) => !existingKeys.has(`${f.name}`)
          )
          return [...prevFiles, ...uniqueNewFiles]
        })
      }
    },
    ///////////////////////////////////////////////////////////////////////////
    //
    // ⚠️ Gotcha: The `setFiles` state setter from useState is referentially stable.
    // However, if you don't include it in the dependency array, then
    // the new React Compiler will freak out:
    //
    //   React Compiler has skipped optimizing this component because the existing manual
    //   memoization could not be preserved. The inferred dependencies did not match the
    //   manually specified dependencies, which could cause the value to change more or
    //   less frequently than expected. The inferred dependency was `setFiles`, but the
    //   source dependencies were []. Inferred dependency not present in source.
    //
    // React's ESLint reacct-hooks plugin was smart enough to allow you to omit the state
    // setter without warning, but the React Compiler doesn't seem to know better, or
    // it has stricter “deps must match what we see” behavior.
    //
    ///////////////////////////////////////////////////////////////////////////
    [setFiles]
  )

  /* ======================
        useDropzone() 
  ====================== */
  ///////////////////////////////////////////////////////////////////////////
  //
  // There's more we can destructure, but currently don't need.
  //
  //   type DropzoneState = DropzoneRef & {
  //     isFocused: boolean;
  //     isDragActive: boolean;
  //     isDragAccept: boolean;
  //     isDragReject: boolean;
  //     isFileDialogActive: boolean;
  //     acceptedFiles: File[];
  //     fileRejections: FileRejection[];
  //     rootRef: React.RefObject<HTMLElement>;
  //     inputRef: React.RefObject<HTMLInputElement>;
  //     getRootProps: <T extends DropzoneRootProps>(props?: T) => T;
  //     getInputProps: <T extends DropzoneInputProps>(props?: T) => T;
  //   };
  //
  // There's also a lot more we can add to options:
  //
  //   type DropzoneOptions = Pick<React.HTMLProps<HTMLElement>, PropTypes> & {
  //     accept?: Accept;
  //     minSize?: number;
  //     maxSize?: number;
  //     maxFiles?: number;
  //     preventDropOnDocument?: boolean;
  //     noClick?: boolean;
  //     noKeyboard?: boolean;
  //     noDrag?: boolean;
  //     noDragEventsBubbling?: boolean;
  //     disabled?: boolean;
  //     onDrop?: <T extends File>(
  //       acceptedFiles: T[],
  //       fileRejections: FileRejection[],
  //       event: DropEvent
  //     ) => void;
  //     onDropAccepted?: <T extends File>(files: T[], event: DropEvent) => void;
  //     onDropRejected?: (fileRejections: FileRejection[], event: DropEvent) => void;
  //     getFilesFromEvent?: (
  //       event: DropEvent
  //     ) => Promise<Array<File | DataTransferItem>>;
  //     onFileDialogCancel?: () => void;
  //     onFileDialogOpen?: () => void;
  //     onError?: (err: Error) => void;
  //     validator?: <T extends File>(file: T) => FileError | FileError[] | null;
  //     useFsAccessApi?: boolean;
  //     autoFocus?: boolean;
  //   };
  //
  ///////////////////////////////////////////////////////////////////////////

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    disabled: disabled,
    ...dropzoneOptions, // maxSize, multiple:false, etc.
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
    // ⚠️ Gotcha: The label's htmlFor is correctly wired up to the inputId, such that the file dialog will open
    // when the label is clicked. However, this seems to bypass giving focus to the input first,
    // prior to opening the fila dialog (I think). Essentially, it bypasses some mechanism that is
    // important to work in conjunction with the File System Access API that's triggered by the
    // onFileDialogCancel() callback. Consequently, a more robust approach entails programmatically
    // clicking the DropzoneBase's <div> element from within the DropzoneLabel.
    //
    //   onClick={() => {
    //     if (!internalRef.current) return
    //     internalRef.current.click()
    //   }}
    //
    ///////////////////////////////////////////////////////////////////////////
    useFsAccessApi: true,
    onDrop
  })

  /* ======================
          rootProps 
  ====================== */
  ///////////////////////////////////////////////////////////////////////////
  //
  // rootProps are applied to the dropzone <div>.
  //
  // According to Hamed Bahram video https://www.youtube.com/watch?v=eGVC8UUqCBE
  // at 5:30, all props/attrs should be passed through getRootProps(), rather than applied directly.
  //
  // The docs also recommend this approach. This is to ensure that we don't inadvertently overwrite
  // props set by rootProps. That said, in some cases (e.g., className) it's okay to set props
  // directly.
  //
  ///////////////////////////////////////////////////////////////////////////

  const dropzoneClasses = cn(
    baseClasses,
    isInvalid && 'border-destructive focus:border-destructive focus:ring-destructive/50',
    isValid && 'border-success focus:border-success focus:ring-success/50',
    isDragActive && 'border-success focus:border-success focus:ring-success/50',
    className,
    // Setting pointer-events: none is important. Otherwise when disabled
    // if one drops a file it will open a new tab with that file.
    disabled && 'pointer-events-none border-neutral-400 focus:border-neutral-400 focus:ring-0'
  )

  // Rather than doing <div { ...getRootProps() } />, we can configure & destructure them here.
  const { ref: rootPropsRef, ...otherRootProps }: any = getRootProps({
    className: dropzoneClasses,
    id: id,
    'aria-labelledby': id,
    'aria-label': 'File upload area',
    onBlur: (e: React.FocusEvent<HTMLDivElement, Element>) => {
      onBlur?.(e)
    },
    onFocus: (_e: React.FocusEvent<HTMLDivElement, Element>) => {},
    style: style,
    role: 'region',
    ...otherProps
  })

  /* ======================
      deleteFileByName()
  ====================== */
  // Used in renderParagraph2() and <Previews previews={previews} deleteFileByName={deleteFileByName} />
  // Given some fileName arg it filters out the file by that name and assigns newFiles to files state.

  const deleteFileByName = (fileName: string) => {
    setFiles((prevFiles) => {
      if (Array.isArray(prevFiles) && prevFiles.length > 0 && isFileArray(prevFiles)) {
        const newFiles = prevFiles?.filter((file) => file.name !== fileName)

        if (newFiles) {
          return newFiles
        }
      }

      return prevFiles
    })
  }

  /* ======================
            API
  ====================== */

  React.useEffect(() => {
    if (apiRef) {
      const API: DropzoneAPI = {
        clear: () => {
          setFiles(null)
        }
      }
      apiRef.current = API
    }
  }, []) // eslint-disable-line

  /* ======================
        useEffect() 
  ====================== */

  useEffect(() => {
    if (!showPreviews) {
      setFilePreviews([], setPreviews)
      return
    }

    ///////////////////////////////////////////////////////////////////////////
    ///
    // If showPreviews is true then pass files and the setPreviews setter.
    // setFilePreviews() is a utility that generates PreviewObject[] | null:
    //
    //   [{ name: "peter.png", readerResult: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAPc..." }]
    //
    // Then assigns the result to previews state. The previews state is then used as follows:
    //
    //    <Previews previews={previews} deleteFileByName={deleteFileByName} />
    //
    //# Rather than having a setFilePreviews() function, wouldn't it be more idiomatic to
    //# have a usePreviews hook that did all this for us.
    //
    ///////////////////////////////////////////////////////////////////////////

    setFilePreviews(files, setPreviews)
  }, [files, showPreviews])

  /* ======================
  useEffect: Two-way Binding Part 1
  ====================== */
  // Any time files changes internally, call the external onChange().
  // Initially, I was using onChangeRef.current?.(files) to bypass the dependency array.
  // However, onChange is often used to check a dynamic value of touchedFields.files, so
  // we definitely don't want to use that approach.

  useEffect(() => {
    if (hasChangedRef.current === false) return
    // Don't do this: onChangeRef.current?.(files)
    onChange?.(files)
  }, [files]) // eslint-disable-line

  /* ======================
  useEffect: Two-way Binding Part 2
  ====================== */
  ///////////////////////////////////////////////////////////////////////////
  //
  // Two-way binding part 2:
  //
  // Any time value changes externally, call internal setFiles().
  // The gotcha here is that value will often be an array, and each
  // array is a new reference type, which will end up causing an
  // infinite loop. On way of fixing this would be to run a deepEqual()
  // check for value vs files and return early if they're already the same
  //
  // The other option is to create a valueOrFiles constant that represents the single source of
  // truth for files. The valueOrFiles solution is appealing, but it could create unexpected
  // results because internally files is never truly reset.
  //
  // Note: Suppose you are using react-hook-form. In order to prevent triggering the onChange after
  // reset(undefined, {}), you need to have an onChange handler that only validates after having been
  // touched:
  //
  //   onChange={(newValue: any) => {
  //     setValue('files', newValue, {
  //       shouldValidate: touchedFields.files ? true : false,
  //       shouldDirty: true,
  //       shouldTouch: true
  //     })
  //   }}
  //
  ///////////////////////////////////////////////////////////////////////////

  useEffect(() => {
    setFiles((prevFiles) => {
      const isEqual = deepEqual(value, prevFiles)

      if (isEqual) {
        // console.log('returning prevFiles...')
        return prevFiles
      }

      // console.log('returning new value...')
      return value
    })
  }, [value])

  /* ======================
          return
  ====================== */

  return (
    <div
      ref={(node) => {
        // We can't know in advance whether ref will be a function or an object literal.
        // For that reason, we need to use the following conditional logic.
        // https://stackoverflow.com/questions/71495923/how-to-use-the-ref-with-the-react-hook-form-react-library
        if (ref && 'current' in ref) {
          ref.current = node
        } else if (typeof ref === 'function') {
          ref?.(node)
        }

        if (rootPropsRef && 'current' in rootPropsRef) {
          rootPropsRef.current = node
        }

        if (internalRef && 'current' in internalRef) {
          internalRef.current = node
        }
      }}
      {...otherRootProps} // Everything else from getRootProps()
    >
      <input
        // When files are dropped onto the dropzone, it doesn’t trigger the onChange event of this internal input element.
        // Instead, it triggers the onDrop event of the dropzone itself. Despite numerous examples showing an onChange prop
        // beign used here, that is not actually the correct approach.
        {...getInputProps({
          id: inputId,
          name: inputName
        })}
      />

      <svg
        className={cn(
          svgClasses,
          isInvalid && 'text-destructive',
          isValid && 'text-success',
          isDragActive && 'text-success',
          disabled && 'text-neutral-400'
        )}
        fill='currentColor'
        height='80px'
        stroke='currentColor'
        strokeWidth='0' // Or is it ={0}
        viewBox='0 0 24 24'
        width='80px'
      >
        <path fill='none' d='M0 0h24v24H0V0z'></path>
        <path d='M19.35 10.04A7.49 7.49 0 0012 4C9.11 4 6.6 5.64 5.35 8.04A5.994 5.994 0 000 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM19 18H6c-2.21 0-4-1.79-4-4 0-2.05 1.53-3.76 3.56-3.97l1.07-.11.5-.95A5.469 5.469 0 0112 6c2.62 0 4.88 1.86 5.39 4.43l.3 1.5 1.53.11A2.98 2.98 0 0122 15c0 1.65-1.35 3-3 3zM8 13h2.55v3h2.9v-3H16l-4-4z'></path>
      </svg>

      <Paragraph1 disabled={disabled} error={error} files={files} isDragActive={isDragActive} touched={touched} />

      <Paragraph2
        acceptMessage={acceptMessage}
        deleteFileByName={deleteFileByName}
        disabled={disabled}
        files={files}
        fileNames={fileNames}
        isDragActive={isDragActive}
      />

      <Previews disabled={disabled} previews={previews} deleteFileByName={deleteFileByName} />

      <DeleteButton
        disabled={disabled}
        files={files}
        isDragActive={isDragActive}
        setFiles={setFiles}
        setPreviews={setPreviews}
      />
      {/* <DataTest files={files} /> */}
    </div>
  )
}
