// import { Suspense } from 'react'
import {
  Page,
  PageContainer,
  //Spinner,
  Title
} from '@/components'
import { Post } from './Post'

type Params = Promise<{ id: string }>

type PagePostProps = {
  params: Params
}

/* ========================================================================
              
======================================================================== */

export const instant = false

const PagePost = async ({ params }: PagePostProps) => {
  const { id } = await params

  return (
    <Page>
      <PageContainer>
        <Title
          as='h2'
          style={{
            marginBottom: 50,
            textAlign: 'center'
          }}
        >
          Post {id}
        </Title>

        <Post postId={id} />
      </PageContainer>
    </Page>
  )
}

export default PagePost
