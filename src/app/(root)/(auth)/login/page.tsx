import type { Metadata } from 'next'

import { Page, PageContainer, Title } from '@/components'
import { LoginForm } from './components/LoginForm'

export const metadata: Metadata = {
  title: 'Login',
  description: 'The Login Page'
}

/* ========================================================================
                                PageLogin
======================================================================== */
///////////////////////////////////////////////////////////////////////////
//
// ⚠️ Gotcha: LoginForm implements useSearchParams().
// When you run the build, Next.js will try to make this page static.
// However, that conflicts with useSearchParams(), and causes an error.
//
//   ❌ useSearchParams() should be wrapped in a suspense boundary at page "/login".
//   Read more: https://nextjs.org/docs/messages/missing-suspense-with-csr-bailout
//
// Solution: Either make make the page dynamic with:
//
//   export const dynamic = 'force-dynamic'
//
// Or wrap the LoginForm with a Suspense boundary.
// See also useSearchParams() docs: https://nextjs.org/docs/app/api-reference/functions/use-search-params
//
///////////////////////////////////////////////////////////////////////////

const PageLogin = () => {
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
          Login
        </Title>

        <LoginForm />
      </PageContainer>
    </Page>
  )
}

export default PageLogin
