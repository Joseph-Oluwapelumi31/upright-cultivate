import { resend, EMAIL_FROM } from "./resend";

export async function sendVerificationEmail({
  email,
  name,
  otp,
}: {
  email: string;
  name: string;
  otp: string;
}) {
  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h2>Welcome to Upright Cultivate</h2>
      <p>Hi ${name},</p>
      <p>Please use the following verification code to confirm your email address. This code will expire in 15 minutes.</p>
      <div style="background-color: #f4f4f5; padding: 16px; text-align: center; border-radius: 8px; margin: 24px 0;">
        <span style="font-size: 32px; font-weight: bold; letter-spacing: 4px;">${otp}</span>
      </div>
      <p style="color: #666; font-size: 14px;">Do not share this code with anyone. If you did not sign up for this account, you can safely ignore this email.</p>
    </div>
  `;

  const { data, error } = await resend.emails.send({
    from: EMAIL_FROM,
    to: email,
    subject: "Verify your email - Upright Cultivate",
    html,
  });

  if (error) {
    throw new Error(`Resend error: ${error.message}`);
  }

  return data;
}
