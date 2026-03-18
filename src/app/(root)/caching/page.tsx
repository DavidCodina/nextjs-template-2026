import type { Metadata } from 'next'
import { Page, PageContainer, Title } from '@/components'
// import { PostList } from './PostList'
import { UseCacheRemote } from './UseCacheRemote'

export const metadata: Metadata = {
  title: 'Caching',
  description: 'A Caching Demo'
}

/* ========================================================================
              
======================================================================== */
///////////////////////////////////////////////////////////////////////////
//
// A New Caching Paradigm:
//
// Enabling cacheComponents: true in Next.js 16 disables the old route segment directives
// (revalidate, dynamic, etc.). Cache Components introduce a new caching paradigm that is
// intended to replace those older configuration exports. The cacheComponents feature uses
// the 'use cache' directive for granular control, which is incompatible with the older route
// segment config approach. Pages will still be dynamic by default if they perform dynamic
// operations (fetching, using cookies, etc.).
//
// Aurora Scharff discusses the issue here at 3:15.
// https://www.youtube.com/watch?v=OHrtiIuCea0&t=4s
// Next.js is moving in a direction such that they're trying to find a unified model with cache components.
// whereby we will no longer conceputalize pages in terms of a static/dynamic split. Instead, you suspend
// your dynamic content and everything else gets statically rendered.
//
//
// ⚠️ Route segment config "dynamic" is not compatible with `nextConfig.cacheComponents`.
// When cacheComponents:true is enabled globally in next.config.ts, you cannot use
// export const dynamic = 'force-dynamic' (or other dynamic route segment configs) in your pages.
// It doesn't matter if you've never implemented 'use cache' anywhere'.
// It doesn't matter if this component does not have child components that implement 'use cache'.
// As soon as you turn that flag on, 'force-dynamic' is no longer allowed.
//
///////////////////////////////////////////////////////////////////////////

const PageCaching = async () => {
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
          Caching
        </Title>

        <UseCacheRemote />

        {/* <PostList /> */}
      </PageContainer>
    </Page>
  )
}

export default PageCaching
