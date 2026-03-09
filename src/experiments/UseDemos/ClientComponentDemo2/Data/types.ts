import { GetDataResponsePromise } from '../getData'

export type DataProps = {
  promise: GetDataResponsePromise
  onRetry?: () => void
  shouldFetch: boolean
}
