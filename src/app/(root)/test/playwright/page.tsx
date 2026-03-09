import type { Metadata } from 'next'

import { Page, PageContainer } from '@/components'
import { Todos } from './Todos'

export const metadata: Metadata = {
  title: 'Playwright',
  description: 'A Playwright Test Page'
}

/* ========================================================================
              
======================================================================== */

export const instant = false

const PagePlaywright = async () => {
  /* ======================
          return
  ====================== */

  return (
    <Page>
      <PageContainer>
        <h1
          className='mb-12 text-center text-5xl text-stone-500'
          style={{
            fontFamily: 'Chakra Petch',
            fontWeight: 300
          }}
        >
          PLAYWRIGHT
        </h1>

        <Todos />
      </PageContainer>
    </Page>
  )
}

export default PagePlaywright
