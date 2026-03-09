import type { Metadata } from 'next'
import { Page, PageContainer, Title } from '@/components'

export const metadata: Metadata = {
  title: 'Admin Nested',
  description: 'The Admin Nested Page'
}

/* ========================================================================
                                PageAdminNested
======================================================================== */

const PageAdminNested = () => {
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
          Admin Nested
        </Title>
      </PageContainer>
    </Page>
  )
}

export default PageAdminNested
