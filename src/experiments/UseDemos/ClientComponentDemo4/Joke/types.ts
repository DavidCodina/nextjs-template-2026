import { GetJokeResponsePromise } from './getJoke'

export type JokeProps = {
  jokePromise: GetJokeResponsePromise
  onRefresh?: () => void
}
