import type { Metadata } from 'next'
import { Page, PageContainer, Title } from '@/components'
import { ErrorComponent } from './ErrorComponent'

export const metadata: Metadata = {
  title: 'Error Demo',
  description: 'An Error Demo Page'
}

/* ========================================================================
              
======================================================================== */

const PageErrorDemo = async () => {
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
          Error Demo
        </Title>

        <ErrorComponent />
      </PageContainer>
    </Page>
  )
}

export default PageErrorDemo
