import { Resend } from "resend";

export interface EmailProps {
  email: string;
  otp: string;
}

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendVerificationEmail({email, otp}: EmailProps) {
  try {
    await resend.emails.send({
      from: "Vendora Security <auth@support.vendora.sbs>",
      to: email,
      subject: "Verify your Vendora Account",
      html: `
        <div style="font-family: sans-serif; padding: 20px;">
          <h2>Welcome to Vendora!</h2>
          <p>Your 6-digit verification code is:</p>
          <h1 style="letter-spacing: 5px; color: #2563eb;">${otp}</h1>
          <p>This code expires in 10 minutes.</p>
        </div>
      `
    });
  } catch (error) {
    console.error("Mail Error:", error);
  }
}