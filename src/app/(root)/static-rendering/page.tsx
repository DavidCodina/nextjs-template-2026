import type { Metadata } from 'next'
import Link from 'next/link'
import { Page, PageContainer, Title } from '@/components'

export const metadata: Metadata = {
  title: 'Static Rendering',
  description: 'A Static Rendering Page'
}

/* ========================================================================
              
======================================================================== */

const PageStaticRendering = async () => {
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
          Static Rendering
        </Title>

        <div className='text-primary flex flex-col gap-4 *:font-semibold *:hover:underline'>
          <Link href='/static-rendering/1'>Static Page 1</Link>
          <Link href='/static-rendering/1'>Static Page 2</Link>
          <Link href='/static-rendering/1'>Static Page 3</Link>
        </div>
      </PageContainer>
    </Page>
  )
}

export default PageStaticRendering
