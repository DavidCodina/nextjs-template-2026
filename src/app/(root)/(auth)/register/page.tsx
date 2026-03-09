import * as React from 'react'
import type { Metadata } from 'next'
import { Page, PageContainer, Title } from '@/components'
import { RegisterForm } from './components/RegisterForm'

export const metadata: Metadata = {
  title: 'Register',
  description: 'The Register Page'
}

/* ========================================================================
                                PageRegister
======================================================================== */

const PageRegister = () => {
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
          Register
        </Title>

        <RegisterForm />
      </PageContainer>
    </Page>
  )
}

export default PageRegister
