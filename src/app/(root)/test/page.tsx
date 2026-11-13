import type { Metadata } from 'next'

import { Page, PageContainer, Title } from '@/components'
// import { TodoList } from './TodoList'
import { ClientComponent } from './ClientComponent'
// import { ComponentDemos } from '@/components/ComponentDemos'

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

        {/* <TodoList /> */}

        <ClientComponent />
      </PageContainer>
    </Page>
  )
}

export default PageTest
