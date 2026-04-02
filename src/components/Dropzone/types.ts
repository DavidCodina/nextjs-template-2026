import type { ComponentPropsWithRef, MutableRefObject } from 'react'
import type { DropzoneOptions } from 'react-dropzone'

export type DropzoneRef = HTMLDivElement

export type PreviewObject = { name: string; readerResult: string }

export type OnDrop = NonNullable<DropzoneOptions['onDrop']>
// type OnDrop2 = Exclude<DropzoneOptions['onDrop'], undefined>
// type OnDrop3 = Exclude<Pick<DropzoneOptions, 'onDrop'>, undefined>

export type InternalRef = React.RefObject<HTMLDivElement | null>

export type DropzoneBaseProps = Omit<ComponentPropsWithRef<'div'>, 'onChange'> & {
  apiRef?: MutableRefObject<unknown>
  acceptMessage?: string
  disabled?: boolean
  dropzoneOptions?: DropzoneOptions
  error?: string
  inputId?: string
  inputName?: string
  onChange?: (newValue: File[] | null) => void
  showPreviews?: boolean
  touched?: boolean
  value?: File[] | null
}

export type DropzoneLabelProps = React.ComponentProps<'label'> & {
  labelRequired?: boolean
}

export type DropzoneErrorProps = React.ComponentProps<'div'>

export type DropzoneProps = DropzoneBaseProps & {
  groupClassName?: string
  groupStyle?: React.CSSProperties
  labelProps?: DropzoneLabelProps
  errorProps?: Omit<DropzoneErrorProps, 'children'>
}

export interface PreviewProps {
  deleteFileByName: (fileName: string) => void
  disabled: boolean
  previews: PreviewObject[] | null
}
