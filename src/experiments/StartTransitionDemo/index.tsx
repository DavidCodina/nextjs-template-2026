'use client'

import { useTransition, useState, useEffect } from 'react'
import { sleep } from 'utils'

type User = {
  id: number
  name: string
  username: string
}

type GetUserResponse = Promise<User>
type GetUser = (userId: number) => GetUserResponse

const getUser: GetUser = async (userId) => {
  await sleep(2000)
  const res = await fetch(`https://jsonplaceholder.typicode.com/users/${userId}`)
  const json = (await res.json()) as ReturnType<GetUser>
  return json
}

// This demo demonstrates how to prevent rendering stale data
// When rapidly updating a card. That said, even the GoodGetUser
// is not ideal. A better way to approach this would be to have a
// button that makes a debounced API call. In other words, there should
// be a userId and debouncedUserId state so that we can avoid multiple
// API calls.

/* ========================================================================

======================================================================== */

const UserCard = ({ isPending, user, userId, handleGetUser, title }: any) => {
  const renderUser = () => {
    return (
      <div
        className={`mx-auto flex h-[200px] rounded-lg border border-neutral-400 bg-white p-4 text-sm shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px]`}
      >
        {isPending ? (
          <div className='flex-1 self-center text-center text-3xl font-black text-blue-500'>Loading...</div>
        ) : user ? (
          <div className='flex-1'>
            <h3 className='mb-0 font-black text-blue-500'>User: {userId}</h3>
            <pre>{JSON.stringify(user, null, 2)}</pre>
          </div>
        ) : (
          <div className='flex-1 self-center text-center text-3xl font-black text-blue-500'>{title}</div>
        )}
      </div>
    )
  }

  const renderGetUserButton = () => {
    return (
      <button
        className='absolute bottom-0 left-0 w-full rounded-b border border-blue-700 bg-blue-500 px-2 py-1 text-sm font-bold text-white'
        onClick={() => {
          handleGetUser()
        }}
        style={{ minWidth: 150 }}
      >
        {isPending ? `Getting User ${userId}...` : `Get User ${userId + 1 > 10 ? 1 : userId + 1}`}
      </button>
    )
  }

  return (
    <section className='relative w-[300px]'>
      {renderUser()}
      {renderGetUserButton()}
    </section>
  )
}

/* ========================================================================

======================================================================== */

const BadGetUser = () => {
  const [userId, setUserId] = useState(0)
  const [user, setUser] = useState<any>(null)
  const [isPending, setIsPending] = useState(false)

  const handleGetUser = () => {
    setUserId((v) => (v + 1 > 10 ? 1 : v + 1))
  }

  useEffect(() => {
    if (userId === 0) {
      return
    }
    setIsPending(true)
    getUser(userId)
      .then((newUser) => {
        setUser({
          id: newUser.id,
          name: newUser.name,
          username: newUser.username
        })
        return newUser
      })
      .catch((err) => err)
      .finally(() => {
        setIsPending(false)
      })
  }, [userId])

  return (
    <>
      <UserCard isPending={isPending} user={user} userId={userId} handleGetUser={handleGetUser} title='Bad Version' />
    </>
  )
}

/* ========================================================================

======================================================================== */

const GoodGetUser = () => {
  const [userId, setUserId] = useState(0)
  const [user, setUser] = useState<any>(null)
  const [isPending, startTransition] = useTransition()

  const handleGetUser = () => {
    setUserId((v) => (v + 1 > 10 ? 1 : v + 1))
  }

  useEffect(() => {
    if (userId === 0) {
      return
    }

    startTransition(async () => {
      const newUser = await getUser(userId)

      setUser({
        id: newUser.id,
        name: newUser.name,
        username: newUser.username
      })
    })
  }, [userId])

  return (
    <>
      <UserCard isPending={isPending} user={user} userId={userId} handleGetUser={handleGetUser} title='Good Version' />
    </>
  )
}

/* ========================================================================

======================================================================== */

export const StartTransitionDemo = () => {
  return (
    <>
      <div className='my-12 flex justify-center gap-6'>
        <GoodGetUser />
        <BadGetUser />
      </div>
    </>
  )
}
