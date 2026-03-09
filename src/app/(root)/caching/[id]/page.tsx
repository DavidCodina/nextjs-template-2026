import { Suspense } from 'react'
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
///////////////////////////////////////////////////////////////////////////
//
// ⚠️ Gotcha: https://nextjs.org/docs/messages/blocking-route
// https://github.com/vercel/next.js/discussions/85608
// https://stackoverflow.com/questions/79286470/how-to-fix-next-js-15-dynamic-route-prerender-error
//
// With cacheComponents: true in Next.js 16, awaiting params at the top level of a dynamic page.tsx
// is treated as accessing uncached, per-request data outside of a Suspense boundary, which can trigger
// the blocking-route error.
//
// The current guidance from the Next.js team is to either await params deeper in the tree
// (or inside a component wrapped in <Suspense>), or to use generateStaticParams so
// that awaiting params in the page is validated at build time.
//
/////////////////////////
//
// ⚠️ Gotcha: https://nextjs.org/docs/app/api-reference/functions/use-pathname
//
// When cacheComponents is enabled usePathname may require a Suspense boundary around it
// if your route has a dynamic param. Inside of AppProvider I was doing this:
//
//   const pathname = usePathname()
//   const previousPath = useRef<string | null>('')
//
//   useEffect(() => {
//     return () => {
//       previousPath.current = pathname
//      // console.log('previousPath.current:', previousPath.current)
//     }
//   }, [pathname])
//
// This necessitated that I implement a Suspense boundary around AppProvider in Providers.tsx:
//
//
//   export const Providers = ({ children }: PropsWithChildren) => {
//     return (
//       <Suspense fallback={null}>
//         <AppProvider>
//           <NextThemeProvider>{children}</NextThemeProvider>
//         </AppProvider>
//       </Suspense>
//     )
//   }
//
// Note: that Suspense boundary actually prevents you from having to abstract awaiting params further down
// in the component tree of dynamic routes. In fact, putting a Suspense there also allows you to write
// await statements directly within any page.tsx. That's not really bad because it completely removes all
// enforcement of best practices. In any case, I removed the logic in AppProvider. It wasn't necessary.
// Then I removed the Suspense boundary in Providers.tsx.
//
// See also the admin/layout.tsx for a similar issue, that hasn't yet been resolved.
//
///////////////////////////////////////////////////////////////////////////

const PagePostContent = async ({ params }: PagePostProps) => {
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

const PagePost = async (props: PagePostProps) => {
  return (
    <Page>
      <PageContainer>
        <Suspense fallback={null}>
          <PagePostContent {...props} />
        </Suspense>
      </PageContainer>
    </Page>
  )
}

export default PagePost
