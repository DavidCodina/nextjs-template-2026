import type { Metadata } from 'next'
import { Page, PageContainer, Title } from '@/components'

export const metadata: Metadata = {
  title: 'Admin',
  description: 'The Admin Page'
}

/* ========================================================================
                                PageAdmin
======================================================================== */

const PageAdmin = () => {
  // Rather than doing this here, we can just apply it at the level of admin/layout.tsx.
  // const session = await auth()
  // const user    = session?.user
  // const isAdmin = user && user?.roles?.includes('admin')
  // if (!isAdmin) { redirect('/forbidden')}

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
          Admin
        </Title>
      </PageContainer>
    </Page>
  )
}

export default PageAdmin
