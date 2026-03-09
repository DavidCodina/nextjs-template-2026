'use client'

import { FormEvent, useEffect, useMemo, useState } from 'react'

type Todo = {
  id: number
  title: string
  completed: boolean
}

type Filter = 'all' | 'active' | 'completed'

const initialTodos: Todo[] = [
  { id: 1, title: 'Learn Playwright locators', completed: true },
  { id: 2, title: 'Write an end-to-end test', completed: false },
  { id: 3, title: 'Run the test suite', completed: false }
]

/* ========================================================================
              
======================================================================== */

export function Todos() {
  const [todos, setTodos] = useState(initialTodos)
  const [draft, setDraft] = useState('')
  const [filter, setFilter] = useState<Filter>('all')
  const [hydrated, setHydrated] = useState(false)

  const visibleTodos = useMemo(
    () => todos.filter((todo) => filter === 'all' || (filter === 'active' ? !todo.completed : todo.completed)),
    [filter, todos]
  )
  const activeCount = todos.filter((todo) => !todo.completed).length

  /* ======================

  ====================== */

  function addTodo(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const title = draft.trim()
    if (!title) return
    setTodos((current) => [...current, { id: Date.now(), title, completed: false }])
    setDraft('')
  }

  /* ======================

  ====================== */

  function toggleTodo(id: number) {
    setTodos((current) => current.map((todo) => (todo.id === id ? { ...todo, completed: !todo.completed } : todo)))
  }

  /* ======================

  ====================== */

  function removeTodo(id: number) {
    setTodos((current) => current.filter((todo) => todo.id !== id))
  }

  /* ======================

  ====================== */

  function clearCompleted() {
    setTodos((current) => current.filter((todo) => !todo.completed))
  }

  /* ======================
          useEffect()
  ====================== */

  useEffect(() => {
    setHydrated(true)
  }, [])

  /* ======================
        renderHeader()
  ====================== */

  const renderHeader = () => {
    return (
      <div className='flex items-start justify-between gap-4'>
        <div>
          <p className='text-secondary-500 mb-2 text-sm font-semibold tracking-[0.2em] uppercase'>
            Playwright practice
          </p>
          <h1 id='todo-heading' className='text-primary text-3xl font-bold tracking-tight'>
            Todo Test Lab
          </h1>
          <p className='mb-2 text-sm leading-6 text-slate-500'>
            A small client-side app for learning reliable browser tests.
          </p>
        </div>
        <span
          aria-label={`${activeCount} active todos`}

          className='bg-secondary-100 text-secondary-500 border-secondary-200 shrink-0 rounded-full border px-3 py-1 text-sm font-semibold'
        >
          {activeCount} active
        </span>
      </div>
    )
  }

  /* ======================
        renderForm()
  ====================== */

  const renderForm = () => {
    return (
      <form onSubmit={addTodo} className='flex gap-2'>
        <label htmlFor='new-todo' className='sr-only'>
          New todo
        </label>
        <input
          id='new-todo'
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder='What needs to be done?'
          className='focus:border-primary-500 focus:ring-primary-100 placeholder:text-muted-foreground min-w-0 flex-1 rounded border px-2 py-1 text-sm text-slate-900 transition outline-none focus:ring-4'
        />
        <button
          type='submit'
          className='hover:bg-primary-700 bg-primary-600 focus:ring-primary-200 rounded px-2 py-1 text-sm font-semibold text-white transition focus:ring-4 focus:outline-none'
        >
          Add Todo
        </button>
      </form>
    )
  }

  /* ======================
        renderFilter()
  ====================== */

  const renderFilter = () => {
    return (
      <div className='flex flex-wrap items-center justify-between gap-3'>
        <div
          role='group'
          aria-label='Todo filters'
          className='bg-secondary-100 border-secondary-200 flex gap-1 rounded-lg border p-1'
        >
          {(['all', 'active', 'completed'] as Filter[]).map((option) => (
            <button
              key={option}
              type='button'
              aria-pressed={filter === option}
              onClick={() => setFilter(option)}
              className={`rounded-md px-3 py-1.5 text-xs font-semibold capitalize transition ${filter === option ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
            >
              {option}
            </button>
          ))}
        </div>
        <button
          type='button'
          onClick={clearCompleted}
          className='hover:text-primary-600 text-xs font-semibold text-slate-500 underline-offset-4 hover:underline'
        >
          Clear completed
        </button>
      </div>
    )
  }

  /* ======================
        renderList()
  ====================== */

  const renderList = () => {
    return (
      <ul aria-label='Todo items' className='divide-y'>
        {visibleTodos.length > 0 ? (
          visibleTodos.map((todo) => (
            <li key={todo.id} className='flex items-center gap-3 py-2'>
              <input
                type='checkbox'
                checked={todo.completed}
                onChange={() => toggleTodo(todo.id)}
                aria-label={`Mark ${todo.title} as ${todo.completed ? 'active' : 'completed'}`}
                className='accent-primary-500 focus:ring-primary-500 h-5 w-5 rounded border-slate-300 focus:ring-2'
              />

              <span className={`flex-1 text-sm ${todo.completed ? 'text-muted-foreground line-through' : ''}`}>
                {todo.title}
              </span>

              <button
                type='button'
                onClick={() => removeTodo(todo.id)}
                aria-label={`Delete ${todo.title}`}
                className='hover:border-destructive-500 hover:bg-destructive-50 hover:text-destructive-500 focus:ring-destructive-200 rounded-md border border-transparent px-2 py-1 text-xs font-medium text-slate-400 focus:ring-2 focus:outline-none'
              >
                Delete
              </button>
            </li>
          ))
        ) : (
          <li className='py-10 text-center text-sm text-slate-400'>No todos in this view.</li>
        )}
      </ul>
    )
  }

  /* ======================
          return
  ====================== */

  return (
    <section
      aria-labelledby='todo-heading'
      data-testid='todo-app'
      data-hydrated={hydrated ? 'true' : 'false'}
      className='bg-card mx-auto w-full max-w-2xl space-y-4 rounded-2xl border p-4'
    >
      {renderHeader()}

      {renderForm()}

      {renderFilter()}

      {renderList()}
    </section>
  )
}
