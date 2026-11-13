import { Pencil, PencilOff } from 'lucide-react'
import { editableButtonVariants } from './editableButtonVariants'

import type { EditableButtonProps } from '../../types'
import { cn } from '@/utils'

/* ========================================================================
 
======================================================================== */

export const EditableButton = ({
  className = '',
  children,
  disabled = false,
  editable,
  isIcon = true,
  showEditingButton,
  setEditable,
  size,
  style = {},
  variant,
  ...otherProps
}: EditableButtonProps) => {
  const label = editable ? 'Disable editing' : 'Enable editing'

  /* ======================
      renderChildren()
  ====================== */

  const renderChildren = () => {
    if (children) return children
    return editable ? <PencilOff /> : <Pencil />
  }

  /* ======================
          return
  ====================== */

  if (showEditingButton === false) {
    return null
  }

  return (
    <button
      {...otherProps}
      aria-label={label}
      className={cn(
        editableButtonVariants({ variant, size }),
        className,

        {
          'p-[0.375em]': isIcon
        }
      )}
      disabled={disabled}
      onClick={() => {
        setEditable((v) => !v)
      }}
      style={style}
      title={label}
      type='button'
    >
      {renderChildren()}
    </button>
  )
}
