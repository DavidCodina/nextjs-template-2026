import type { Metadata } from 'next'

import { Page, PageContainer, Title } from '@/components'
// import { ClientComponent } from './ClientComponent'

export const metadata: Metadata = {
  title: 'Test',
  description: 'A Test Page'
}

/* ========================================================================
              
======================================================================== */

export const instant = false

const PageTest = async () => {
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
          Test Page
        </Title>

        {/* <ClientComponent /> */}
      </PageContainer>
    </Page>
  )
}

export default PageTest
