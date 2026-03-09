'use client'
import { sleep, randomFail } from 'utils'

type RequestData = { firstName: string; lastName: string }

/* ======================
        Database
====================== */

const users = [
  { id: '12345', firstName: 'Joe', lastName: 'Bazooka' },
  { id: '23456', firstName: 'James', lastName: 'Howlett' }
]

const db = { users }

/* ======================
        getUser()
====================== */

export const getUser = async (id: string) => {
  await sleep(1000)

  try {
    const shouldFail = randomFail(0.25)
    if (shouldFail) {
      throw new Error('Whoops!')
    }

    const index = db.users.findIndex((user) => user.id === id)
    const user = db.users[index]

    if (!user) {
      return {
        data: null,
        message: 'Resource not found.',
        success: false
      }
    }

    return {
      data: user,
      message: 'Request Success.',
      success: true
    }
  } catch (_err) {
    return {
      data: null,
      message: 'Server Error.',
      success: false,
      errors: null
    }
  }
}

/* ======================
      updateUser()
====================== */

export const updateUser = async (id: string, data: RequestData) => {
  const { firstName, lastName } = data
  await sleep(1000)

  const errors: Record<string, string> = {}

  if (typeof firstName !== 'string') {
    errors.firstName = 'Invalid type.'
  } else if (firstName.trim() === '') {
    errors.firstName = 'First name must not be an empty string.'
  }

  if (typeof lastName !== 'string') {
    errors.lastName = 'Invalid type.'
  } else if (lastName.trim() === '') {
    errors.lastName = 'Last name must not be an empty string.'
  }

  if (Object.keys(errors).length > 0) {
    return {
      data: null,
      message: 'Request Failed.',
      success: false,
      errors: errors
    }
  }

  try {
    const index = db.users.findIndex((user) => user.id === id)
    const user = db.users[index]

    if (!user) {
      return {
        data: null,
        message: 'Reource not found.',
        success: false,
        errors: null
      }
    }

    if (firstName) {
      user.firstName = firstName
    }

    if (lastName) {
      user.lastName = lastName
    }

    return {
      data: user,
      message: 'Request Success.',
      success: true
    }
  } catch (_err) {
    return {
      data: null,
      message: 'Server Error.',
      success: false
    }
  }
}
