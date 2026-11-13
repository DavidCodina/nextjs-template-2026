import { useRef } from 'react'
// https://www.youtube.com/watch?v=c_pJCw8mLOE
import { CSVLink } from 'react-csv'
import { csvButtonVariants } from './csvButtonVariants'

import type { ExportCSVButtonProps } from '../../types'
import { cn } from '@/utils'

/* ========================================================================
                              ExportCSVButton
======================================================================== */

export const ExportCSVButton = ({
  className = '',
  csvHeaders,
  data,
  disabled = false,
  fileName = '',
  showExportCSVButton,
  size,
  style = {},
  variant,
  ...otherProps
}: ExportCSVButtonProps) => {
  const csvLinkRef = useRef<any>(null)

  /* ======================
          return
  ====================== */

  if (showExportCSVButton === false) {
    return null
  }

  return (
    <>
      <CSVLink
        data={data}
        // If fileName is provided, but doesn't end in .csv, the package appends it.
        filename={fileName || 'exported-data.csv'}
        // If headers is undefined, then it exports the entire data set.
        headers={csvHeaders}
        ref={csvLinkRef}
        style={{ display: 'none' }}
        target='_blank'
      >
        Hidden CSV Export Link
      </CSVLink>

      <button
        {...otherProps}
        className={cn(csvButtonVariants({ variant, size }), className)}
        disabled={disabled}
        onClick={() => {
          if (csvLinkRef?.current && csvLinkRef?.current?.link) {
            csvLinkRef.current.link.click()
          }
        }}
        style={style}
        type='button'
      >
        Export To CSV
      </button>
    </>
  )
}
