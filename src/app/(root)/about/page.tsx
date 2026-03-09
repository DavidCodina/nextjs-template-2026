import {
  Page,
  PageContainer,
  // Spinner,
  Title
} from '@/components'

/* ========================================================================

======================================================================== */

const About = async () => {
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
          About
        </Title>
      </PageContainer>
    </Page>
  )
}

export default About
