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
          <p>Your verification code is:</p>
          <h1 style="letter-spacing: 5px; color: #2563eb;">${otp}</h1>
          <p>This code expires in 10 minutes.</p>
        </div>
      `
    });
  } catch (error) {
    console.error("Mail Error:", error);
  }
}

export async function contactVendora(name: string, email: string, subject: string, body: string,){
  try {
    await resend.emails.send({
      from: "Vendora Support <mail@support.vendora.sbs>",
      to: "muguropeter15@gmail.com",
      replyTo: email,
      subject: `Subject ${subject} from ${name}`,
      text: body
    })
  } catch (error) {
    console.error("Mail Error:", error);
    console.log("Error sending E-Mail. Please try again", error)
  }
}