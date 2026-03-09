'use client'
import { useTransition, useState } from 'react'
import { sleep } from 'utils'

type User = {
  id: number
  name: string
  username: string
}

type GetUserResponse = Promise<User>
type GetUser = (userId: number) => GetUserResponse

//# Add try/catch
const getUser: GetUser = async (userId) => {
  await sleep(2000)
  const res = await fetch(`https://jsonplaceholder.typicode.com/users/${userId}`)
  const json = (await res.json()) as ReturnType<GetUser>
  return json
}

/* ========================================================================

======================================================================== */

//# Learn more about batching and transitions and render cycle...
//# https://www.epicreact.dev/react-forms
//# https://www.freecodecamp.org/news/react-19-actions-simpliy-form-submission-and-loading-states/

//# Lydia Hallie : https://www.youtube.com/watch?v=T8TZQ6k4SLE&t=8880s
// You In React 19 there's a new form action attribute that one can pass a function to. Is this function always tagged as 'transition'?
// This means that any state updates triggered by this function will be marked as non-urgent, allowing React to prioritize other updates and keep the UI responsive
// This is particularly useful for handling asynchronous tasks, such as API calls, without blocking the main thread.

// async operations like fetching data or setTimeout don't block the main thread.

// Currently, state updates after an await keyword within startTransition are not maked as transitinos
// Lydia Hallie talks about this in ReactConf 2024. If you needed state updates AFTER an await to
// be marked as transitions, then you need to use a nested startTransition. This is just a temporary
// issue.
export interface GetUserButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  activeKey?: number
  isPending?: boolean
  buttonKey: number
}

export const GetUserButton = ({
  buttonKey,
  activeKey,
  isPending,
  children,
  className,
  ...otherProps
}: GetUserButtonProps) => {
  /* ======================
        getClassName()
  ====================== */

  const getClassName = () => {
    let classes = 'flex-1 px-2 py-1 text-sm font-bold'

    if (activeKey === buttonKey) {
      classes = `${classes} bg-blue-500 text-white`
    } else {
      classes = `${classes} bg-white text-blue-500`
    }

    if (className) {
      classes = `${classes} ${className}`
    }
    return classes
  }

  /* ======================
          return
  ====================== */

  return (
    <button {...otherProps} className={getClassName()}>
      {isPending && activeKey === buttonKey ? 'Loading...' : children}
    </button>
  )
}

/* ========================================================================

======================================================================== */
//# Type the props...

const UserGetter = ({ isPending, user, currentUser, handleUpdateUser, title }: any) => {
  const userIds = [1, 2, 3]

  const renderUser = () => {
    return (
      <div
        className={`mx-auto flex h-[200px] rounded-lg border border-neutral-400 bg-white p-4 text-sm shadow-[rgba(0,0,0,0.24)_0px_3px_8px]`}
      >
        {isPending ? (
          <div className='flex-1 self-center text-center text-3xl font-black text-blue-500'>Loading...</div>
        ) : user ? (
          <div className='flex-1'>
            <h3 className='mb-0 font-black text-blue-500'>User: {user.id}</h3>
            <pre>{JSON.stringify(user, null, 2)}</pre>
          </div>
        ) : (
          <div className='flex-1 self-center text-center text-3xl font-black text-blue-500'>{title}</div>
        )}
      </div>
    )
  }

  const renderUserButtons = () => {
    return (
      <div className='absolute bottom-0 left-0 flex w-full overflow-hidden rounded-b-lg border border-blue-800'>
        {userIds.map((userId, index) => {
          return (
            <GetUserButton
              key={userId}
              buttonKey={userId}
              activeKey={currentUser}
              className={index + 1 !== userIds.length ? 'border-r border-blue-800' : ''}
              onClick={() => handleUpdateUser(userId)}
              isPending={isPending}
            >
              User {userId}
            </GetUserButton>
          )
        })}
      </div>
    )
  }

  return (
    <div className='relative w-[300px]'>
      {renderUserButtons()}
      {renderUser()}
    </div>
  )
}

/* ========================================================================

======================================================================== */

export const BadUserGetter = () => {
  const [currentUser, setCurrentUser] = useState<number>()
  const [user, setUser] = useState<any>(null)
  const [isPending, setIsPending] = useState(false)

  const handleUpdateUser = async (id: number) => {
    setCurrentUser(id)
    setIsPending(true)
    const newUser = await getUser(id)

    setUser(() => {
      return {
        id: newUser.id,
        name: newUser.name,
        username: newUser.username
      }
    })
    setIsPending(false)
  }

  return (
    <UserGetter
      isPending={isPending}
      user={user}
      currentUser={currentUser}
      handleUpdateUser={handleUpdateUser}
      title='Bad Version'
    />
  )
}

/* ========================================================================

======================================================================== */
// In this example, each call to the database, and subsequent setUser is wrapped
// in a startRequestTransition. Each request takes 2 seconds. If you click on
// one button, then another, then another, you will have three pending transitions.
// React will not show the final result until all three transitions settle. In this
// way, we can prevent the UI from showing stale data.
// React will wait for all transitions to settle before updating the UI, which is a key feature of the useTransition hook.

//
// The problem I have with this implementation is that it seems very contrived.
export const GoodUserGetter = () => {
  const [currentUser, setCurrentUser] = useState<number>()
  const [user, setUser] = useState<any>(null)
  const [requestTransitionPending, startRequestTransition] = useTransition()

  const handleUpdateUser = (id: number) => {
    setCurrentUser(id)
    startRequestTransition(async () => {
      const newUser = await getUser(id)

      setUser(() => {
        return {
          id: newUser.id,
          name: newUser.name,
          username: newUser.username
        }
      })
    })
  }

  return (
    <UserGetter
      isPending={requestTransitionPending}
      user={user}
      currentUser={currentUser}
      handleUpdateUser={handleUpdateUser}
      title='Good Version'
    />
  )
}

/* ========================================================================

======================================================================== */

export const StartTransitionDemo3 = () => {
  return (
    <div className='my-12 flex justify-center gap-6'>
      <GoodUserGetter />
      <BadUserGetter />
    </div>
  )
}
