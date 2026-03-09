'use client'

import { useId, useRef } from 'react'

import { DropzoneBase } from './DropzoneBase'
import { DropzoneError } from './DropzoneError'
import { DropzoneLabel } from './DropzoneLabel'

import type { DropzoneProps } from './types'

export type DropzoneAPI = {
  clear: () => void
}

// Todo:
// Test against file-upload-server-2026
// Bonus: Jan Marshal - https://www.youtube.com/watch?v=83bECYmPbI4
// Bonus: Cand Dev - https://www.youtube.com/watch?v=ohXb62KwTak
// Bonus: Convert demos to use Tanstack Form instead of RHF.

/* ========================================================================
                                Dropzone
======================================================================== */
///////////////////////////////////////////////////////////////////////////
//
// Docs:          https://react-dropzone.js.org/#!/Dropzone
// Hamed Bahram:  https://www.youtube.com/watch?v=eGVC8UUqCBE
// James Q Quick: https://www.youtube.com/watch?v=SBL3dhKs21o
//
// Note: By default, Next.js has a 1MB body size upload limit.
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

export const Dropzone = ({
  acceptMessage = '',
  apiRef,
  className = '',
  disabled,
  dropzoneOptions = {},
  error = '',
  groupClassName = '',
  groupStyle = {},
  id,
  inputId,
  inputName,
  style = {},
  onBlur,
  onChange,
  ref,
  showPreviews = true,
  touched = false,
  value = null,
  labelProps = {},
  errorProps = {},
  // otherProps include anything else that can be passed to the <div>.
  ...otherProps
}: DropzoneProps) => {
  const internalRef = useRef<HTMLDivElement | null>(null)
  /* ======================
          constants 
  ====================== */

  // Done here, rather than in DropzoneBase, so it can be passed to DropzoneLabel.
  const fileInputId = useId()
  inputId = inputId || fileInputId

  // disabled can be set directly as a prop (which has priority), or it can be set through dropzoneOptions
  disabled =
    typeof disabled === 'boolean'
      ? disabled
      : typeof dropzoneOptions.disabled === 'boolean'
        ? dropzoneOptions.disabled
        : false

  /* ======================
          return
  ====================== */
  ///////////////////////////////////////////////////////////////////////////
  //
  // The styles here are a modified version of what's done in
  // https://horizon-ui.com/docs-tailwind/docs/react/dropzone
  // Horizon UI does not have open source code for this component.
  //
  // horizon-ui makes the top-level JSX element a button, but because in this implementation
  // there are nested buttons, I've made it a <div> because I was getting console warnings that
  // <button> cannot appear as a descendant of <button>. In any case React Dropzone already
  // bakes in the tabbing and 'Enter' behavior.
  //
  ///////////////////////////////////////////////////////////////////////////

  return (
    <section className={groupClassName} style={groupStyle}>
      <DropzoneLabel
        htmlFor={inputId}
        {...labelProps}
        disabled={disabled}
        internalRef={internalRef}
        error={error}
        touched={touched}
      />

      <DropzoneBase
        acceptMessage={acceptMessage}
        apiRef={apiRef}
        className={className}
        disabled={disabled}
        dropzoneOptions={dropzoneOptions}
        error={error}
        id={id}
        inputId={inputId}
        inputName={inputName}
        internalRef={internalRef}
        style={style}
        onBlur={onBlur}
        onChange={onChange}
        ref={ref}
        showPreviews={showPreviews}
        touched={touched}
        value={value}
        {...otherProps}
      />

      <DropzoneError {...errorProps} children={error} disabled={disabled} error={error} touched={touched} />
    </section>
  )
}
