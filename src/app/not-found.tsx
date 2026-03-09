'use client'

import { useRouter, usePathname } from 'next/navigation'
import { Button, Page, PageContainer, Title } from 'components'

/* ========================================================================
                                NotFound
======================================================================== */
// https://beta.nextjs.org/docs/routing/error-handling
// You only need one of these files, unless you want them to be specific
// to a particular resource.
// Note: If you're not logged in, and you try to go to a nonexistent route, then the current
// auth logic will redirect you to the login page.

export default function NotFound() {
  const pathname = usePathname()
  const router = useRouter()

  return (
    <Page>
      <PageContainer>
        <Title
          as='h2'
          style={{
            marginBottom: 50,
            textAlign: 'center'
          }}
          color='var(--color-destructive)'
        >
          Not Found!
        </Title>

        <p className='text-destructive mb-6 text-center text-xl font-bold'>
          Could not find the requested resource: {pathname}
        </p>

        <Button className='mx-auto flex' onClick={router.back} style={{ minWidth: 100 }} variant='destructive'>
          Go Back
        </Button>
      </PageContainer>
    </Page>
  )
}
