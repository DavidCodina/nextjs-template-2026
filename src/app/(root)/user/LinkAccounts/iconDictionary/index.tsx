'use client'

import { KeyRound } from 'lucide-react'

import { Google } from './Google'
import { GitHub } from './GitHub'
import { LinkedIn } from './LinkedIn'

export const iconDictionary = {
  github: <GitHub className='size-4' />,
  google: <Google className='size-4' />,
  linkedin: <LinkedIn className='size-4' />,
  default: <KeyRound className='size-4' />
}
