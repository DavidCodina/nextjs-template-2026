export type Todo = {
  id: string
  title: string
  description?: string
  isOptimistic?: boolean
}

export type FormValues = { title: string; description: string }
