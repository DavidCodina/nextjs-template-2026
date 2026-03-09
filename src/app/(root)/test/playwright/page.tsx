import type { Metadata } from 'next'

import { Page, PageContainer } from '@/components'
import { Todos } from './Todos'
import { ClickCounter } from './ClickCounter'

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

        <section className='mb-6 flex flex-wrap justify-center gap-2'>
          <ClickCounter variant='red' data-testid='default-counter' />
          <ClickCounter variant='orange' data-testid='initial-counter' initialCount={10} />
          <ClickCounter variant='yellow' data-testid='step-counter' step={5} />
          <ClickCounter variant='green' data-testid='max-counter' max={3} />
          <ClickCounter variant='blue' data-testid='disabled-counter' disabled />
        </section>

        <Todos />
      </PageContainer>
    </Page>
  )
}

export default PagePlaywright
