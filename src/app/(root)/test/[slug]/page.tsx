import type { Metadata } from 'next'
import { Page, PageContainer, Title } from '@/components'
import { MyParams } from './components/MyParams'

type Params = Promise<{ slug: string }>

export const metadata: Metadata = {
  title: 'Test',
  description: 'A Test Page'
}

/* ========================================================================
              
======================================================================== */
///////////////////////////////////////////////////////////////////////////
//
// Note: You'll often see that the recommeded fix is to:
//
//   Move the await into a child component wrapped in <Suspense>. For params and
//   searchParams, forward the promise into the child and await it there; don’t
//   await at the page top. The static shell (Page, PageContainer, the spacing)
//   can then be prerendered and sent immediately, and only the slug-dependent part streams in.
//
// I disagree 100%. The practice of wrapping everything in <Suspense> then doing the actual
// await at a lower level is the worst DX I'v ever seen.
//
//
// https://nextjs.org/docs/messages/blocking-prerender-dynamic#allow-blocking-route
//
///////////////////////////////////////////////////////////////////////////
export const instant = false

const PageTest = async ({ params }: { params: Params }) => {
  const { slug } = await params

  /* ======================
          return
  ====================== */

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
          {slug} Page
        </Title>

        <MyParams />
      </PageContainer>
    </Page>
  )
}

export default PageTest
