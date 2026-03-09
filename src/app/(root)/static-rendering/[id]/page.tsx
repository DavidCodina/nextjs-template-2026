import type { Metadata, ResolvingMetadata } from 'next'
import { Page, PageContainer, Title } from '@/components'

type Params = Promise<{ id: string }>
type Props = { params: Params }

export async function generateMetadata(
  { params /* , searchParams */ }: Props,
  _parent: ResolvingMetadata
): Promise<Metadata> {
  const { id } = await params
  return {
    title: `Static Page ${id}`,
    description: `The static page for id ${id}.`
  }
}

///////////////////////////////////////////////////////////////////////////
//
// ⚠️ Gotcha: The primary layout.tsx was using cookies() as part of the the SidebarProvider implementation.
//
//   const cookieStore = await cookies()
//   Using cookies() in a layout makes the entire route segment (and all child routes) dynamic, even with generateStaticParams.
//   const defaultOpen = cookieStore.get('sidebar_state')?.value === 'true'
//
// However, there's a MAJOR problem with that. It causes every child page.tsx that would otherwise be built
// as static to instead be built as a dynamic page.
//
// What's worse is that in the case of the static pages that we're trying to build here, the build output
// will look correct:
//
//   ├ ● /static-rendering/[id]                 685 B         308 kB
//   ├   ├ /static-rendering/1
//   ├   ├ /static-rendering/2
//   ├   └ /static-rendering/3
//
//   ...
//
//   ○  (Static)   prerendered as static content
//   ●  (SSG)      prerendered as static HTML (uses generateStaticParams)
//   ƒ  (Dynamic)  server-rendered on demand
//
// But in actual practice, the pages won't behave statically because the build
// doesn't actually generate the associated .html pages (i.e., silently fails).
//
// The ShadCN SidebarProvider is no longer using cookies() or the defaultOpen prop.
// In the future, if we really want that feature, we can instead read from localStorage.
//
//# Update: I'm not sure if this is expected behavior, but now with Next.js 16 and cacheComponents:true,
//# the build output is as follows. I can't tell if generateStaticParams is working.
//
//   ├ ○ /static-rendering
//   ├ ◐ /static-rendering/[id]
//   │ ├ /static-rendering/[id]
//
//
//
///////////////////////////////////////////////////////////////////////////

// This function runs during build time.
export async function generateStaticParams() {
  // generateStaticParams should return an array of objects where each object
  // represents the populated dynamic segments of a single route.
  return [{ id: '1' }, { id: '2' }, { id: '3' }]
}

const PageContent = async ({ params }: Props) => {
  const { id } = await params

  return (
    <>
      <Title
        as='h2'
        style={{
          marginBottom: 50,
          textAlign: 'center'
        }}
      >
        Static Page {id}
      </Title>
    </>
  )
}

/* ========================================================================
              
======================================================================== */

const PageStaticDetails = async (props: Props) => {
  /* ======================
          return
  ====================== */

  return (
    <Page>
      <PageContainer>
        <PageContent {...props} />
      </PageContainer>
    </Page>
  )
}

export default PageStaticDetails
