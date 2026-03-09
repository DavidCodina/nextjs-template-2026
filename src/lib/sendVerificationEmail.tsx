import { Resend } from 'resend'
import { VerifyEmailTemplate } from './VerifyEmailTemplate'

type SendVerificationEmailArg = {
  email: string
  name: string
  /** The URL the user clicks in order to verify their email. This will also redirect to the application. */
  url: string
}

const resend = new Resend(process.env.RESEND_API_KEY!)

/* ========================================================================

======================================================================== */

export const sendVerificationEmail = async ({ email: _email, name, url }: SendVerificationEmailArg) => {
  ///////////////////////////////////////////////////////////////////////////
  //
  // It seems that there's no direct way to change the URL from within auth.ts, so you just need to
  // hack it here. Use verified=true to conditionally trigger a toast notification saying that the
  // user has been verified.
  // https://www.answeroverflow.com/m/1376818662257725460
  //
  //   const urlObj = new URL(url)
  //   urlObj.searchParams.set('callbackURL', '/login?verified=true')
  //   url = urlObj.toString()
  //
  // But actually there is a way. Use callbackURL: '/login?verified=true' from within the Better Auth signUp().
  //
  ///////////////////////////////////////////////////////////////////////////

  try {
    await resend.emails.send({
      ///////////////////////////////////////////////////////////////////////////
      //
      // With Resend, you have to use specific email adddresses that resend provides
      // for testing purposes. If you have a Pro account ($20/month), you can use your
      // own domain email. However, I've also heard that it's free to use for up to one domain (?).
      //
      // For now, I've hardcoded the `to` address to go to delivered@resend.dev.
      // Obviously, this means the end user won't receieve the email at their true email for now.
      // Instead, go to resend.com/emails -> Sending to view the email.
      //
      // When clicking on the "Verify Email" link from within Resend's preview dashboard, it won't work.
      // You actually need to right-click, and open link in a new tab.
      //
      // In a real email (Gmail, Outlook, Apple Mail, etc.) the link will be fully clickable — it's a standard
      // <Link> (anchor tag) in the HTML, so email clients render it normally. The reason it's not directly
      // clickable in Resend's preview dashboard is that Resend's preview runs in their cloud environment,
      // and localhost URLs are unreachable from there.
      //
      // In development, that will take you to: http://localhost:3000/ by default. However, I've changed the logic
      // in in sendVerificationEmail() such that it now redirects to /login?verified=true.
      // At that point the user's emailVerified will change to true in the database.
      // This is all demonstrated in the Brett Westwood tutorial at 40:20: https://www.youtube.com/watch?v=-qJ4-H00e0g
      //
      ///////////////////////////////////////////////////////////////////////////
      from: 'onboarding@resend.dev', // In production use domain email.
      to: ['delivered@resend.dev'], // In production use the actual email.
      subject: 'Email Verification',
      react: <VerifyEmailTemplate name={name} url={url} />
    })
  } catch (_err) {
    console.log('\n\nError sending verification email.', _err)
  }
}
