// import * as React from 'react'

import {
  Body,
  // Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  // Tailwind, // 👈🏻👈🏻👈🏻
  Text
} from '@react-email/components'

type ResetPasswordTemplateProps = {
  url: string
  name: string
}

/* ======================

====================== */

const main = {
  backgroundColor: '#ffffff',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif'
}

const container = {
  margin: '0 auto',
  padding: '20px 0 48px',
  maxWidth: '560px'
}

const heading = {
  fontSize: '24px',
  letterSpacing: '-0.5px',
  lineHeight: '1.3',
  fontWeight: '400',
  color: '#484848',
  padding: '17px 0 0'
}

const paragraph = {
  margin: '0 0 15px',
  fontSize: '15px',
  lineHeight: '1.4',
  color: '#3c4149'
}

const buttonContainer = {
  padding: '27px 0 27px'
}

const reportLink = {
  fontSize: '14px',
  color: '#b4becc'
}

const hr = {
  borderColor: '#dfe1e4',
  margin: '42px 0 26px'
}

/* ========================================================================

======================================================================== */

export const ResetPasswordTemplate = ({ name, url }: ResetPasswordTemplateProps) => {
  return (
    <Html>
      <Head />
      <Body style={main}>
        <Preview>Reset Your Password</Preview>
        <Container style={container}>
          <Heading style={heading}>Hi {name}!</Heading>
          <Section style={buttonContainer}></Section>
          <Text style={paragraph}>
            A password reset request was received for your account. Please click the button below to reset your
            password.
          </Text>
          <Hr style={hr} />

          <Link href={url} style={reportLink}>
            Click here to reset your password.
          </Link>
        </Container>
      </Body>
    </Html>
  )
}
