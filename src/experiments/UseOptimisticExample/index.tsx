'use client'

import { useState, useOptimistic, useTransition } from 'react'

import { toast /* useSonner */ } from 'sonner'
import { sleep /* , randomFail */ } from 'utils'
import { CreateTodoForm, FormValues } from './CreateTodoForm'
import { TodoList } from './TodoList'
import { Todo } from './types'

/* ========================================================================

======================================================================== */

export const UseOptimisticExample = () => {
  const [todos, setTodos] = useState<Todo[]>([
    {
      id: '12345',
      title: 'Default Todo',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'
    }
  ])
  const [optimisticTodos, setOptimisticTodos] = useOptimistic(todos)
  const [isPending, startTransition] = useTransition()

  /* ======================
        handleSubmit()
  ====================== */

  const handleSubmit = async ({ title, description = '' }: FormValues) => {
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
      // const _shouldFail = randomFail(0.25)
      // if (_shouldFail) { throw new Error('Whoops!') }

      if (res.success === true && res.data !== null) {
        const newTodo = res.data
        setTodos((prev) => {
          return [newTodo, ...prev]
        })
      } else {
        toast.error('Unable to add todo!')
      }
    } catch (_err) {
      // If an error occurs we need to roll back.
      // But actually, this will happen automatically if setTodos() is never called.
      toast.error('Unable to add todo!')
    }
  }

  /* ======================

  ====================== */

  return (
    <>
      <CreateTodoForm
        defaultValues={{
          title: 'Learn Python',
          description: 'Review more on FastAPI'
        }}
        transitionPending={isPending}
        ///////////////////////////////////////////////////////////////////////////
        //
        // handleSubmit must be wrapped in startTransion(() => { ... })
        // handleSubmit must contain the logic for both setOptimisticTodos() and setTodos().
        //
        // When we wrap handleSubmit in startTransition() we're essentially allowing React to treat
        // the optimistic update and the final update as separate operations.
        //
        // Often, startTransition() is described as a way to "unbatch" the two state updates.
        // As a casual explanation that works, but technically they're still batched together in the sense
        // that they're part of the same render cycle. However, wrapping handleSubmit() in startTransition() allows
        // React to treat the state updates as separate (decoupled) operations in terms of user experience.
        // The UI can reflect the optimistic state immediately, while the final state update can be processed later.
        //
        // By wrapping handleSubmit() in startTransition(), we're saying, "Call setOptimisticTodos() and setTodos(),
        // but don't wait for both of them to complete before updating the UI." In other words, we don't want to wait
        // on setTodos() before updating optimisticTodos. We don't want setTodos() to block/prevent
        // setOptimisticTodos() from updating the UI immediately.
        //
        ///////////////////////////////////////////////////////////////////////////
        onSubmit={(formValues) => {
          startTransition(() => handleSubmit(formValues))
        }}
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

const apiCreateTodo = async ({ title, description }: FormValues): CreateTodoResponse => {
  try {
    await sleep(3000)

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
