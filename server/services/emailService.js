const { Resend } = require('resend')

const resend = new Resend(process.env.RESEND_API_KEY)

// Password reset email
const sendPasswordResetEmail = async (toEmail, resetToken, userName) => {
  const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`

  try {
    await resend.emails.send({
      from: 'DevHive <onboarding@resend.dev>',
      to: toEmail,
      subject: 'Reset your DevHive password',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 24px;">
          <h2 style="color: #1E293B;">Reset your password</h2>
          <p style="color: #64748B;">Hi ${userName},</p>
          <p style="color: #64748B;">We received a request to reset your DevHive password. Click the button below to set a new password. This link expires in 1 hour.</p>
          <a href="${resetUrl}" style="display: inline-block; background: #4F8CFF; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; margin: 16px 0;">
            Reset Password
          </a>
          <p style="color: #94A3B8; font-size: 13px;">If you didn't request this, you can safely ignore this email.</p>
        </div>
      `
    })
    return true
  } catch (err) {
    console.error('Email send error:', err.message)
    return false
  }
}

// Project invitation email
const sendInviteEmail = async (toEmail, inviterName, projectName, isExistingUser) => {
  const loginUrl = `${process.env.CLIENT_URL}/${isExistingUser ? 'login' : 'register'}`

  try {
    await resend.emails.send({
      from: 'DevHive <onboarding@resend.dev>',
      to: toEmail,
      subject: `${inviterName} invited you to join "${projectName}" on DevHive`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 24px;">
          <h2 style="color: #1E293B;">You've been invited! 🎉</h2>
          <p style="color: #64748B;"><b>${inviterName}</b> has invited you to join the project <b>"${projectName}"</b> on DevHive — an engineering mission control platform.</p>
          <a href="${loginUrl}" style="display: inline-block; background: #4F8CFF; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; margin: 16px 0;">
            ${isExistingUser ? 'Sign in to accept' : 'Create account to accept'}
          </a>
          <p style="color: #94A3B8; font-size: 13px;">${isExistingUser ? "Sign in and you'll see this invite on your dashboard." : 'Create a free account with this email to see your invite.'}</p>
        </div>
      `
    })
    return true
  } catch (err) {
    console.error('Invite email error:', err.message)
    return false
  }
}

module.exports = { sendPasswordResetEmail, sendInviteEmail }