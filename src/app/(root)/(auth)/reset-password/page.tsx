import type { Metadata } from 'next'

import { Page, PageContainer, Title } from '@/components'
import { ResetPasswordForm } from './components/ResetPasswordForm'

export const metadata: Metadata = {
  title: 'Reset Password',
  description: 'The Reset Password Page'
}

/* ========================================================================

======================================================================== */
// In the coding in flow tutorial, it can detect if there's no token in the URL.
// https://github.com/codinginflow/better-auth-tutorial/blob/final-project/src/app/(auth)/reset-password/page.tsx
// He implements an alert in this page if there's no token search parameter in the URL.
// However, if you're using the new Next.js cacheComponents:true feature, then you'll instead
// want to pass searchParams diretly into the ResetPasswordForm component.
// Alternatively, you can implement useSearchParams() internally.

const PageResetPassword = () => {
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
          Reset Password
        </Title>

        <ResetPasswordForm />
      </PageContainer>
    </Page>
  )
}

export default PageResetPassword
