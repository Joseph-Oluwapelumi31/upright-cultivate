import { resend, EMAIL_FROM } from "./resend";

export async function sendPasswordResetEmail({
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
      <h2>Password Reset Request</h2>
      <p>Hi ${name || "there"},</p>
      <p>We received a request to reset the password for your Upright Cultivate account. Please use the following code to reset your password. This code will expire in 15 minutes.</p>
      <div style="background-color: #f4f4f5; padding: 16px; text-align: center; border-radius: 8px; margin: 24px 0;">
        <span style="font-size: 32px; font-weight: bold; letter-spacing: 4px;">${otp}</span>
      </div>
      <p style="color: #666; font-size: 14px;">Do not share this code with anyone. If you did not request a password reset, you can safely ignore this email.</p>
    </div>
  `;

  const { data, error } = await resend.emails.send({
    from: EMAIL_FROM,
    to: email,
    subject: "Reset your password - Upright Cultivate",
    html,
  });

  if (error) {
    throw new Error(`Resend error: ${error.message}`);
  }

  return data;
}
