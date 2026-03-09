import { GetDataResponsePromise } from '../getData'

export type DataWithUseProps = {
  promise: GetDataResponsePromise
  onRetry?: () => void
  shouldFetch: boolean
}
