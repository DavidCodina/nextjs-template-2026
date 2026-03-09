'use client'

import { useState } from 'react'
import { Prisma } from '@/generated/prisma/client'
import { Button } from '@/components'
import { createPost, deletePost, getPost, getPosts, updatePost } from '@/actions'
import { toast } from 'sonner'

type PrismaPost = Prisma.PostGetPayload<{}>
type Post = Omit<PrismaPost, 'createdAt' | 'updatedAt'> & {
  createdAt: string
  updatedAt: string
}

/* ========================================================================
              
======================================================================== */

export const ClientComponent = () => {
  const [posts, setPosts] = useState<Post[] | null>(null)

  const [loadingPosts, setLoadingPosts] = useState(false)
  const [loadingPost, setLoadingPost] = useState(false)
  const [creatingPost, setCreatingPost] = useState(false)
  const [updatingPost, setUpdatingPost] = useState(false)
  const [deletingPost, setDeletingPost] = useState(false)

  const singlePostId = posts && posts[0] ? posts[0].id : 'ABC123'

  /* ======================

  ====================== */

  const handleGetPosts = async () => {
    if (loadingPosts) return
    setLoadingPosts(true)

    const { data, success } = await getPosts()

    if (success === true && Array.isArray(data)) {
      setPosts(data)
    }

    setLoadingPosts(false)
  }

  /* ======================

  ====================== */

  const handleGetPost = async () => {
    if (loadingPost) return
    setLoadingPost(true)

    const { data, errors, message, success } = await getPost(singlePostId)

    if (success === true && data && typeof data === 'object') {
      toast.success('Post request succeeded. Check browser console.')
      console.log(data)
    } else {
      toast.error(message)
      if (errors) {
        console.log(errors)
      }
    }

    setLoadingPost(false)
  }

  /* ======================

  ====================== */

  const handleCreatePost = async () => {
    if (creatingPost) return
    setCreatingPost(true)

    const { data: newPost, success } = await createPost({
      title: `Holly Post ${crypto.randomUUID()}`,
      body: 'Yuk, yuk, yuk...'
    })

    if (success === true && newPost && typeof newPost === 'object') {
      console.log('newPost', newPost)
      // setPosts((v) => {
      //   if (Array.isArray(v)) {
      //     return [newPost, ...v]
      //   }
      //   return [v]
      // })
    }

    setCreatingPost(false)
  }

  /* ======================

  ====================== */

  const handleUpdatePost = async () => {
    if (deletingPost) return
    setUpdatingPost(true)

    const title = posts && posts[0] ? posts[0].title : ''

    const { data, errors, message, success } = await updatePost(singlePostId, {
      title: `${title} (UPDATED)`
    })

    if (success === true && data && typeof data === 'object') {
      toast.success('Updated post. Check browser console.')
      console.log(data)
    } else {
      toast.error(message)

      if (errors) {
        console.log(errors)
      }
    }

    setUpdatingPost(false)
  }

  /* ======================

  ====================== */

  const handleDeletePost = async () => {
    if (deletingPost) return
    setDeletingPost(true)

    const { data, errors, message, success } = await deletePost(singlePostId)

    if (success === true && data && typeof data === 'object') {
      toast.success('Deleted post. Check browser console.')
      console.log(data)
    } else {
      toast.error(message)
      if (errors) {
        console.log(errors)
      }
    }

    setDeletingPost(false)
  }

  /* ======================
          
  ====================== */

  const renderPosts = () => {
    if (loadingPosts) {
      return <div className='text-primary mb-6 text-center text-2xl font-black'>Loading...</div>
    }

    if (posts && Array.isArray(posts)) {
      return (
        <pre className='bg-card mx-auto w-fit max-w-full overflow-x-auto rounded-lg border p-6 text-sm shadow-sm'>
          <code>{JSON.stringify(posts, null, 2)}</code>
        </pre>
      )
    }

    return null
  }

  /* ======================
          return
  ====================== */

  return (
    <div>
      <div className='mb-4 flex flex-wrap justify-center gap-4'>
        <Button loading={loadingPosts} className='min-w-25' onClick={handleGetPosts} size='sm' variant='info'>
          {loadingPosts ? 'Loading...' : 'Get Posts'}
        </Button>

        <Button loading={loadingPost} className='min-w-25' onClick={handleGetPost} size='sm' variant='info'>
          {loadingPost ? 'Loading...' : `Get Post ${singlePostId}`}
        </Button>

        <Button className='min-w-25' loading={creatingPost} onClick={handleCreatePost} size='sm' variant='success'>
          {creatingPost ? 'Creating...' : 'Create Post'}
        </Button>

        <Button className='min-w-25' loading={deletingPost} onClick={handleUpdatePost} size='sm' variant='warning'>
          {updatingPost ? 'Updating...' : `Update Post ${singlePostId}`}
        </Button>

        <Button className='min-w-25' loading={deletingPost} onClick={handleDeletePost} size='sm' variant='destructive'>
          {deletingPost ? 'Deleting...' : `Delete Post ${singlePostId}`}
        </Button>
      </div>

      {renderPosts()}
    </div>
  )
}

// const MyButton = () => {
//   const handleClick = () => {
//     console.log('Button clicked!')
//   }

//   return (
//     <button
//       onClick={handleClick}
//       className='relative overflow-hidden rounded-lg border border-white/20 bg-linear-to-r from-purple-500 via-pink-500 to-red-500 px-8 py-4 text-lg font-bold text-white shadow-lg shadow-purple-500/25 backdrop-blur-sm transition-all duration-300 ease-out before:absolute before:inset-0 before:translate-y-full before:bg-white/20 before:transition-transform before:duration-300 hover:scale-105 hover:shadow-xl hover:shadow-purple-500/40 hover:before:translate-y-0 active:scale-95'
//     >
//       <span className='relative z-10 flex items-center gap-2'>
//         <svg
//           className='h-5 w-5 transition-transform duration-300 group-hover:rotate-12'
//           fill='none'
//           stroke='currentColor'
//           viewBox='0 0 24 24'
//         >
//           <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M13 10V3L4 14h7v7l9-11h-7z' />
//         </svg>
//         Magic Button
//       </span>
//     </button>
//   )
// }
