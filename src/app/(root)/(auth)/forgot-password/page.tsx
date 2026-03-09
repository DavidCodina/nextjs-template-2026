import type { Metadata } from 'next'

import { Page, PageContainer, Title } from '@/components'
import { ForgotPasswordForm } from './components/ForgotPasswordForm'

export const metadata: Metadata = {
  title: 'Forgot Password',
  description: 'The Forgot Password Page'
}

/* ========================================================================

======================================================================== */

const PageForgotPassword = () => {
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
          Forgot Password
        </Title>

        <ForgotPasswordForm />
      </PageContainer>
    </Page>
  )
}

export default PageForgotPassword
