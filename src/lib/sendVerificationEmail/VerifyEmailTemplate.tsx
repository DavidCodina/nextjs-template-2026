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

type VerificationEmailTemplateProps = {
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
///////////////////////////////////////////////////////////////////////////
//
// ✅ Brett Westwood at 32:30 : https://www.youtube.com/watch?v=-qJ4-H00e0g
//   See here also for more on Resend, but not Better Auth: https://www.youtube.com/watch?v=QyGJLm55EDk
//
// ✅ OrcDev                  : https://www.youtube.com/watch?v=psEbIHyuutk
//    He uses a cool AI tool (by Resend) for generating email code: https://new.email/
//    It seems to generate templates using react-email + <Tailwind>
//
// ✅ Coding In FLow at 53:45 : https://www.youtube.com/watch?v=w5Emwt3nuV0
//   ❗️ Review and possibly implement davidscript.com domain.
//   At 1:02:40 he also mentions the importance of having resend verification email functionality.
//   However, the way he went about implementing it didn't make any sense. He seemed to be doing it
//   AFTER there was already a valid user session. This worked for him because he wasn't requiring
//   that the user be verified prior to logging in. On the other hand, I do require it.
//
// https://better-auth.com/docs/concepts/email
// https://react.email/docs/integrations/resend
//
//  ⚠️ Gotcha: The react-email docs say to do this:
//
//   npm install resend @react-email/components
//
// However, the Resend SDK requires @react-email/render as a separate
// peer dependency to actually render the React component to HTML internally:
//
//   npm install @react-email/render -E
//
// https://resend.com/login
// Logged in with gmail then go to API Keys -> Create API Key -> store in .env as RESEND_API_KEY
//
///////////////////////////////////////////////////////////////////////////

export const VerifyEmailTemplate = ({ name, url }: VerificationEmailTemplateProps) => {
  return (
    <Html>
      <Head />
      <Body style={main}>
        <Preview>Verify your Email with Better Auth</Preview>
        <Container style={container}>
          <Heading style={heading}>Hi {name}!</Heading>
          <Section style={buttonContainer}></Section>
          <Text style={paragraph}>
            Thank you for signing up! Please click the button below to verify your email address and complete your
            registration.
          </Text>
          <Hr style={hr} />

          {/* Example URL: "http://localhost:3000/api/auth/verify-email?token=abc123;callbackURL=%2F" 
          When testing, go to resend.com/emails -> Sending to view the email. I tried clidking on it,
          but at least in Preview mode it didn't work. You actually need to right-click, and open link in a new tab.
          
          In a real email (Gmail, Outlook, Apple Mail, etc.) the link will be fully clickable — it's a standard 
          <Link> (anchor tag) in the HTML, so email clients render it normally. The reason it's not directly 
          clickable in Resend's preview dashboard is that Resend's preview runs in their cloud environment, 
          and localhost URLs are unreachable from there. 

          In development, that will take you to: http://localhost:3000/
          At that point the user's emailVerified will change to true in the database.
          This is all demonstrated in the Brett Westwood tutorial at 40:20: https://www.youtube.com/watch?v=-qJ4-H00e0g
          */}
          <Link href={url} style={reportLink}>
            Click here to verify your email address
          </Link>
        </Container>
      </Body>
    </Html>
  )
}
