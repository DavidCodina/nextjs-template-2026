import { Suspense } from 'react'
import { AlertCircle } from 'lucide-react'
import { Alert, Spinner, UpdateTagButton } from '@/components'
import { getPost } from '@/actions/cached.actions'

type PostProps = {
  postId: string
}

/* ========================================================================
              
======================================================================== */

const Post = async ({ postId }: PostProps) => {
  const { /* code, */ data: post, message, success } = await getPost(postId)

  /* ======================

  ====================== */

  const renderContent = () => {
    if (success !== true) {
      return (
        <Alert
          leftSection={<AlertCircle className='size-6' />}
          // rightSection={<RetryButton>Retry</RetryButton>}
          title={'Error'}
          variant={'destructive'}
          className='mx-auto my-6 max-w-[800px] bg-rose-50/10'
        >
          {message}
        </Alert>
      )
    }

    if (success === true && post && typeof post === 'object') {
      return (
        <>
          <UpdateTagButton
            className='mx-auto mb-6 flex'
            // Client-side only
            // onUpdated={(result) => { console.log('\nUpdate result:', result) }}
            shouldLog={true}
            tag={`post-${postId}`}
            size='sm'
          >
            Update Post {postId} (Last Updated: {message})
          </UpdateTagButton>

          <pre className='bg-card mx-auto mb-6 max-w-[800px] overflow-scroll rounded-lg border p-4 text-sm shadow'>
            {JSON.stringify(post, null, 2)}
          </pre>
        </>
      )
    }

    return null
  }

  /* ======================
          return
  ====================== */

  return <>{renderContent()}</>
}

/* ========================================================================
              
======================================================================== */

const PostWithSuspense = (props: PostProps) => {
  const fallback = (
    <div className='py-12'>
      <Spinner className='mx-auto block' size={50} />
    </div>
  )

  return (
    <Suspense fallback={fallback}>
      <Post {...props} />
    </Suspense>
  )
}

export { PostWithSuspense as Post }
