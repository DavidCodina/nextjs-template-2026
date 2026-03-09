'use client'

import { useState, useOptimistic } from 'react'
import { toast /* useSonner */ } from 'sonner'
import { sleep } from 'utils'
import { CreateTodoForm } from './CreateTodoForm'
import { TodoList } from './TodoList'
import { FormValues, Todo } from './types'

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

/* ========================================================================

======================================================================== */

export const UseOptimisticExample2 = () => {
  const [todos, setTodos] = useState([{ id: '12345', title: 'Default Todo' }])
  const [optimisticTodos, setOptimisticTodos] = useOptimistic(todos)
  const [status, setStatus] = useState<'idle' | 'pending' | 'success' | 'error'>('idle')

  /* ======================
          onSubmitAction
  ====================== */

  const onSubmitAction = async ({ title, description = '' }: FormValues) => {
    // Prevent the await apiCreateTodo(value) from blocking.
    // This is better than using setTimeout(() => { setStatus('pending') }, 0)
    // Because in this case, the microtask runs dooner.
    queueMicrotask(() => {
      setStatus('pending')
    })

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

      if (res.success === true && res.data !== null) {
        const newTodo = res.data
        setTodos((prev) => {
          return [newTodo, ...prev]
        })

        setStatus('idle')
      } else {
        toast.error('Unable to add todo!')
        setStatus('error')
      }
    } catch (_err) {
      toast.error('Unable to add todo!')
      setStatus('error')
    }
  }

  /* ======================

  ====================== */

  return (
    <>
      <CreateTodoForm onSubmitAction={onSubmitAction} status={status} />
      <TodoList todos={optimisticTodos} />
    </>
  )
}
