import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendOrderConfirmation = async (email: string, orderNumber: string, amount: number) => {
  try {
    await resend.emails.send({
      from: "Vendora <orders@support.vendora.sbs>",
      to: email,
      subject: `Order Confirmed: ${orderNumber}`,
      html: `
        <h1>Payment Received!</h1>
        <p>Your order <strong>${orderNumber}</strong> has been confirmed.</p>
        <p>Amount Paid: KES ${amount}</p>
        <p>We will notify you about logistics via email. Stay connected</p>
      `
    })
  } catch (error){
    console.error("Email failed to send:", error)
  }
};