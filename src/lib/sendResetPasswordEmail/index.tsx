import { Resend } from 'resend'
import { ResetPasswordTemplate } from './ResetPasswordTemplate'

type SendResetPasswordEmailArg = {
  email: string
  name: string
  /** The URL the user clicks in order to verify their email. This will also redirect to the application. */
  url: string
}

const resend = new Resend(process.env.RESEND_API_KEY!)

/* ========================================================================

======================================================================== */
///////////////////////////////////////////////////////////////////////////
//
// ✅ Coding In Flow at 1:08:00 : https://www.youtube.com/watch?v=w5Emwt3nuV0
// ✅ WDS at 1:28:50            : https://www.youtube.com/watch?v=WPiqNDapQrk
// ✅  OrcDev                   : https://www.youtube.com/watch?v=dZpHdVkKYcs
// Cand Dev at ...              : https://www.youtube.com/watch?v=829nKH5FmCs
//
///////////////////////////////////////////////////////////////////////////

export const sendResetPasswordEmail = async ({ email: _email, name, url }: SendResetPasswordEmailArg) => {
  try {
    await resend.emails.send({
      from: 'onboarding@resend.dev', // In production use domain email.
      to: ['delivered@resend.dev'], // In production use the actual email.
      subject: 'Password Reset',
      react: <ResetPasswordTemplate name={name} url={url} />
    })
  } catch (_err) {
    // console.log('\n\nError sending password reset email.', _err)
  }
}
