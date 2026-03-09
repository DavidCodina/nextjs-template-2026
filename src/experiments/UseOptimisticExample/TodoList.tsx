'use client'

import { Todo } from './types'
type Props = { todos: Todo[] }

/* ========================================================================

======================================================================== */

export const TodoList = ({ todos }: Props) => {
  return (
    <ul className='mx-auto mb-6 flex max-w-[600px] flex-col rounded pl-0'>
      {todos.map((todo) => {
        return (
          <li
            className={`relative block cursor-pointer border border-neutral-400 bg-white px-2 py-2 text-sm shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px] first:rounded-t-[inherit] last:rounded-b-[inherit] [&:not(:first-child)]:border-t-0`}
            key={todo.id}
          >
            <div className='flex'>
              <div className='mb-2 w-[40px] font-bold text-blue-500'>id:</div>{' '}
              {todo.isOptimistic ? (
                <div className='font-bold text-green-500'>Pending...</div>
              ) : (
                <div className='font-mono text-pink-500'>{todo.id}</div>
              )}
            </div>
            <div className='flex'>
              <div className='min-w-[40px] font-bold text-blue-500'>title:</div> <div>{todo.title}</div>
            </div>

            {todo.description && (
              <div className='mt-4'>
                <div>{todo.description}</div>
              </div>
            )}
          </li>
        )
      })}
    </ul>
  )
}
