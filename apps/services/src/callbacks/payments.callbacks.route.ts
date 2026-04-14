import { Order, Subscription } from "@vendora/db";
import express, { Router, type Request, type Response } from "express";
import { handleOrderPayment } from "./../helpers/handleOrderPayment.js";
import { handleSubscriptionPayment } from "./../helpers/handleSubscriptionPayment.js";
import { sendOrderConfirmation } from "../payments/email.services.js";
import Stripe from "stripe";

interface PaymentMetadata extends Stripe.Metadata {
  type: "order" | "subscription";
  orderId?: string;
  transactionDesc?: string;
  subscriptionId?: string;
  sellerId?: string;
}

const ignoredEvents = [
  'payment_intent.succeeded',
  'payment_intent.created',
  'charge.succeeded',
  'charge.updated',
  'payment_intent.updated'
];

const router = Router();
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

router.post("/m-chwapez", async (req, res) => {
  res.json({ ResultCode: 0, ResultDesc: "Success" });

  const { Body } = req.body;
  const { ResultCode, ResultDesc, CheckoutRequestID, CallbackMetadata } = Body.stkCallback;

  if (ResultCode !== 0) {
    return console.warn(`M-Pesa Payment Failed: ${ResultDesc}`);
  }

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mpesaReceipt = CallbackMetadata.Item.find((i: any) => i.Name === "MpesaReceiptNumber")?.Value;
    
    const order = await Order.findOne({
      $or: [
        {"payments.commitment.checkoutRequestId": CheckoutRequestID},
        {"payments.balance.checkoutRequestId": CheckoutRequestID}
      ]
    });

    if (order) {
      return await handleOrderPayment(order, CheckoutRequestID, mpesaReceipt, req)
    };

    const subscription = await Subscription.findOne({ checkoutRequestId: CheckoutRequestID });
    
    if (subscription) {
      return await handleSubscriptionPayment(subscription, mpesaReceipt, req)
    }  
  } catch (error) {
    console.error("Callback Error:", error);
  }
});

router.post("/stripe", express.raw({ type: "application/json"}), async (req: Request, res: Response) => {
  const sig = req.headers["stripe-signature"];

  if (!sig || !endpointSecret) {
    return res.status(400).send("Webhook Error: Missing signature or secret");
  }

  let event: Stripe.Event;
   
  try {
    event = Stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (error) {
    console.error("Webhook Error", error);
    return res.status(400).send({error: "Internal server error"})
  }

  if (ignoredEvents.includes(event.type)) {
    return res.json({ received: true });
  } 

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const metadata = session.metadata as PaymentMetadata;

      if (!metadata) return res.status(400).send("No metadata found");

      const { type, orderId, subscriptionId, transactionDesc } = metadata;

      if (type === "subscription") {
        const sub = await Subscription.findById(subscriptionId);
        if (!sub) return;
        await handleSubscriptionPayment(sub, session.id, req);
      } else {
        const order = await Order.findById(orderId);
        if (!order) return;
        await handleOrderPayment(order, session.id, session.id, req);
      }
      
      if (orderId && transactionDesc !== "Balance Payment") {        
        const updatedOrder = await Order.findByIdAndUpdate(orderId, {
          status: "awaitingDispatch",
          "payments.commitment.status": "paid",      
          "payments.commitment.paidAt": new Date(),
          "payments.commitment.receiptNumber": session.payment_intent as string
        }, { new: true });        

        if (updatedOrder) {
          await sendOrderConfirmation(
            session.customer_details?.email || updatedOrder.buyer.email,
            updatedOrder.orderNumber,
            session.amount_total!
          ).catch(err => console.error("Email failed:", err));
        }
        console.log(`Payment succeeded for session: ${session.id}`);
      } else {
        const updatedOrder = await  Order.findByIdAndUpdate(orderId, {
          "payments.balance.status": "paid",
          "payments.paidAt": new Date(),
          "payments.balance.receiptNumber": session.payment_intent as string,
          "financials.balanceDue": 0
        })

        if (updatedOrder) {
          await sendOrderConfirmation(
            session.customer_details?.email || updatedOrder.buyer.email,
            updatedOrder.orderNumber,
            session.amount_total!
          ).catch(err => console.error("Email failed:", err));
        }
        console.log(`Payment fully paid for session: ${session.id}`);
      }
      break; 
    }
    
    case "payment_intent.payment_failed":
      { const failedIntent = event.data.object as Stripe.PaymentIntent;
        console.log(`Payment failed: ${failedIntent.id}`);
        break;
      }
    
    case "checkout.session.expired": {
      const session = event.data.object as Stripe.Checkout.Session;
      const orderId = session.metadata?.orderId;

      if (orderId) {      
        await Order.findByIdAndUpdate(orderId, {
          status: "rejected",
          "payments.commitment.status": "failed",
          "rejectionMetaData.reason": "Stripe Checkout session expired"
        });      
        console.log(`Order ${orderId} marked as failed due to session expiry.`)
      }
      break;
    }

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
});

export { router as PaymentCallbackRouter }