'use client'

import { useState, useActionState, useEffect, useOptimistic } from 'react'
import { toast /* useSonner */ } from 'sonner'
import { sleep, randomFail } from 'utils'
import { CreateTodoForm } from './CreateTodoForm'
import { TodoList } from './TodoList'
import { FormValues, Todo } from './types'

type ActionState = { message: string; success: boolean } | null

/* ========================================================================

======================================================================== */

export const UseOptimisticExample3 = () => {
  const [todos, setTodos] = useState<Todo[]>([
    {
      id: '12345',
      title: 'Default Todo',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'
    }
  ])

  const [optimisticTodos, setOptimisticTodos] = useOptimistic(todos)

  /* ======================
      onSubmitAction()
  ====================== */

  const onSubmitAction = async (_previousState: ActionState, formData: FormData) => {
    const title = formData.get('title')
    const description = (typeof formData.get('description') === 'string' ? formData.get('description') : '') as string

    if (typeof title !== 'string') {
      return {
        message: `Unable to add todo. 'title' is not a string.`,
        success: false
      }
    }

    const newOptimisticTodo = {
      id: crypto.randomUUID(),
      title,
      description,
      isOptimistic: true
    }

    setOptimisticTodos((prev) => {
      return [newOptimisticTodo, ...prev]
    })

    try {
      const res = await apiCreateTodo({ title, description })

      const shouldFail = randomFail(0.25)
      if (shouldFail) {
        throw new Error('Whoops!')
      }

      if (res.success === true && res.data !== null) {
        const newTodo = res.data
        setTodos((prev) => {
          return [newTodo, ...prev]
        })
      }
      return {
        message: res.message,
        success: res.success
      }
    } catch (_err) {
      return {
        message: 'The request failed!',
        success: false
      }
    }
  }

  const [actionState, formAction, isPending] = useActionState(onSubmitAction, null)

  /* ======================
        useEffect()
  ====================== */

  useEffect(() => {
    if (!actionState) {
      return
    }

    if (actionState.success === true) {
      toast.success(actionState.message)
    } else if (actionState.success === false) {
      toast.error(actionState.message)
    }
  }, [actionState])

  /* ======================
          return
  ====================== */

  return (
    <>
      <CreateTodoForm
        defaultValues={{
          title: 'Read A Book',
          description: 'Educate yourself by reading...'
        }}
        onSubmitAction={formAction}
        isPending={isPending}
      />

      <TodoList todos={optimisticTodos} />
    </>
  )
}

/* ========================================================================

======================================================================== */

type API_Response<T = unknown> = Promise<{
  data: T
  message: string
  success: boolean
  errors?: Record<string, string> | null
}>

type Data = Todo | null

type CreateTodoResponse = API_Response<Data>

const apiCreateTodo = async ({ title, description = '' }: FormValues): CreateTodoResponse => {
  try {
    await sleep(1500)

    const todo: Todo = {
      id: Date.now().toString(),
      title,
      description
    }
    return {
      data: todo,
      message: 'Request Success.',
      success: true
    }
  } catch (_err) {
    return {
      data: null,
      message: 'Request failed.',
      success: false
    }
  }
}
