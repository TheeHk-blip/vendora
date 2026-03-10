/* eslint-disable @typescript-eslint/no-explicit-any */
import express, { Router, type Request, type Response } from "express";
import Stripe from "stripe";
import { stripe } from "./stripe.config.js";
import { Buyer, Order, Variant, type IVariant, type LeanArray } from "@vendora/db";
import { nanoid } from "nanoid";
import axios from "axios";
import { sendOrderConfirmation } from "./email.services.js";
import { getMpesaAccessToken } from "./mpesa.service.js";

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
const shipping = Number(process.env.SHIPPING_FEE ?? 0);
const router = Router();

const formatPhoneNumber = (phone: string) => {
  let cleaned = phone.replace(/\D/g, "");
  if (cleaned.startsWith("0")) cleaned = "254" + cleaned.slice(1);
  if (cleaned.startsWith("7") || cleaned.startsWith("1")) cleaned = "254" + cleaned;
  if (cleaned.startsWith("+")) cleaned = cleaned.substring(1);
  return cleaned;
};

const ignoredEvents = [
  'payment_intent.succeeded',
  'payment_intent.created',
  'charge.succeeded',
  'charge.updated',
  'payment_intent.updated'
];

const getMpesaAuth = () => {
  const timestamp = new Date().toISOString().replace(/[-:T.Z]/g, "").slice(0, 14);
  const password = Buffer.from(
    `${process.env.MPESA_SHORTCODE}${process.env.MPESA_PASSKEY}${timestamp}`
  ).toString("base64");
  return { timestamp, password};
}

router.post("/stk-push", async (req, res) => {
  let order: any = null;
  try {
    const { formData, orderItems, buyerId, buyerEmail, checkoutSelection } = req.body;
    const phoneNumber = formatPhoneNumber(formData.phone);       

    Buyer.findOneAndUpdate(
      { userId: buyerId },
      {
        $set: {
          phoneNumber: formData.phone,
          shippingAddress: {
            county: formData.county,
            subCounty: formData.subCounty,
            ward: formData.ward
          }
        }
      },
      {   
        new: true,
        setDefaultsOnInsert: true
      }
    ).exec();

    const variantIds = orderItems.map((item: any) => item.variantId);    
    const [dbVariants, accessToken] = await Promise.all([
      Variant.find({ _id: {$in: variantIds }}).lean<IVariant[]>(),
      getMpesaAccessToken()
    ]) 
    const variantMap = new Map<string, IVariant>(dbVariants.map((v: IVariant) => [v._id.toString(), v]));

    let totalProductValue = 0;
    let amountToPay: number;
    let balanceDue: number;    
    const verifiedItems = orderItems.map(( item: any ) => {
      const dbVar = variantMap.get(item.variantId);
      if (!dbVar) throw new Error(`Product variant ${item.variantId} not found`);
      const itemTotal = dbVar.price * item.quantity;
      totalProductValue += itemTotal;

      return {
        variantId: dbVar._id,
        name: item.name,
        price: dbVar.price,
        quantity: item.quantity,
        seller: {
          sellerId: item.merchantId,
          storeName: item.merchant
        },
        deliveryToHub: { status: "pending" }
      };
    });

    if (checkoutSelection === "partial") {
      amountToPay = shipping;
      balanceDue = totalProductValue;
    } else {
      amountToPay = totalProductValue + shipping;
      balanceDue = 0;
    }

    order = await Order.create({
      orderNumber: `VEN-${nanoid(8).toUpperCase()}`,
      paymentType: checkoutSelection,
      buyer: {
        buyerId: buyerId,
        email: buyerEmail,
        phone: formData.phone,
        name: `${formData.firstName} ${formData.lastName}`,
        location: {
          county: formData.county,
          subCounty: formData.subCounty,
          ward: formData.ward
        }
      },
      seller: {
        sellerId: orderItems[0]?.merchantId,
        storeName: orderItems[0]?.merchant,
        isWarehoused: false
      },
      items: verifiedItems,
      financials: {
        totalProductValue,
        commitmentFee: amountToPay,
        balanceDue,
        commisionRate: 0.1,
        platformRevenue: totalProductValue * 0.1,
        sellerPayout: totalProductValue * 0.9
      },
      payments: {
        commitment: {
          status: "pending",           
        },
        balance: {
          balanceDue: balanceDue,
          status: balanceDue === 0 ? "paid" : "pending"
        }
      },
      status: "awaitingCommitment"
    });

    const { timestamp, password } = getMpesaAuth();

    const stkResponse = await axios.post(
      "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
      {
        BusinessShortCode: process.env.MPESA_SHORTCODE,
        Password: password,
        Timestamp: timestamp,
        TransactionType: "CustomerPayBillOnline",
        Amount: "1",
        PartyA: phoneNumber,
        PartyB: process.env.MPESA_SHORTCODE,
        PhoneNumber: phoneNumber,
        CallBackURL: `${process.env.PAYMENT_CALLBACK}`,
        AccountReference: "VendoraPay",
        TransactionDesc: "Online Order"
      },
      { headers: { Authorization: `Bearer ${accessToken}` } },
    );

    Order.findByIdAndUpdate(order._id, {
      "payments.commitment.checkoutRequestId": stkResponse.data.CheckoutRequestID
    }).exec();

    if (stkResponse.data.ResponseCode === "0") {
      return res.json({
        success: true,
        message: "STK Push Sent",       
        orderNumber: order.orderNumber,
        orderId: order._id,
        amount: amountToPay
      });
    } else {
      throw new Error("Safaricom rejected the STK request");
    }

  } catch (error: any) {
    console.error("STK Push Error:", error);

    if (order) {
      await Order.findByIdAndUpdate(order._id, {
        status: "rejected",
        "payments.commitment.status": "failed"
      });
    }

    if (error.name === "ValidationError") {
      console.error("Mongoose Validation Error:", error.message)
      return res.status(400).json({ error: error.message });
    }

    if (error.response) {
      console.error("Safaricom Error Data:", error.response.data)
      return res.status(503).json(error.response.data)
    }

    return res.status(500).json({ error: error.message || "Internal Server Error"});
  }
});

router.post("/callback", async (req, res) => {
  res.json({  ResultCode: 0, ResultDesc: "Success"});

  const { Body } = req.body;
  const { ResultCode, ResultDesc, CheckoutRequestID, CallbackMetadata } = Body.stkCallback;

  if (ResultCode !== 0) {
    return console.warn(`M-Pesa Payment Failed: ${ResultDesc}`);
  }
  
  try {
    const mpesaReceipt = CallbackMetadata.Item.find((i: any) => i.Name === "MpesaReceiptNumber")?.Value;

    const updatedOrder = await Order.findOneAndUpdate(
      {
        $or: [
          {"payments.commitment.checkoutRequestId": CheckoutRequestID},
          {"payments.balance.checkoutRequestId": CheckoutRequestID}
        ]
      },
      {
        $set: {
          status: "awaitingDispatch"
        }
      },
      { new: true }
    );

    if (!updatedOrder) return console.error("Order not found for ID:", CheckoutRequestID);
    const isBalance = updatedOrder.payments.balance.checkoutRequestId === CheckoutRequestID;
    const updatePath = isBalance ? "payments.balance" : "payments.commitment";

    await updatedOrder.updateOne({
      $set: {
        [`${updatePath}.status`]: "paid",
        [`${updatePath}.receipNumber`]: mpesaReceipt,
        [`${updatePath}.paidAt`]: new Date()
      }
    });

    const io = req.app.get("io");
    io.to(updatedOrder._id.toString()).emit("payment-status", {
      status: "paid",
      receipt: mpesaReceipt
    });

    if (updatedOrder && updatedOrder.buyer.email) {
      const amountPaid = isBalance
        ? updatedOrder.financials.balanceDue
        : updatedOrder.financials.commitmentFee;

      sendOrderConfirmation(
        updatedOrder.buyer.email,
        updatedOrder.orderNumber,
        amountPaid
      ).catch(err => console.error("Email failed:", err));    
    }    
  } catch (error) {
    console.error("Callback Error:", error);
  }
});

router.post("/cancel-order", async (req,res) => {
  const { orderId } = req.body;

  await Order.findByIdAndUpdate(orderId, {
    status: "rejected",
    "payments.commitment.status": "failed",
    "rejectionMetaData.reason": "User cancelled on status page"
  })

  req.app.get("io").to(orderId).emit("payment-status", { status: "failed" });

  res.json({ success: true });
})

router.post("/webhook", express.raw({ type: "application/json"}), async (req: Request, res: Response) => {
  const sig = req.headers["stripe-signature"];

  if (!sig || !endpointSecret) {
    return res.status(400).send("Webhook Error: Missing signature or secret");
  }

  let event: Stripe.Event;
   
  try {
    event = Stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err: any) {
    console.error(`Webhook Error: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`)
  }

  if (ignoredEvents.includes(event.type)) {
    return res.json({ received: true });
  } 

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const orderId = session.metadata?.orderId;
      
      if (orderId) {        
        const updatedOrder = await Order.findByIdAndUpdate(orderId, {
          status: "awaitingDispatch",
          "payments.commitment.status": "paid",      
          "payments.commitment.paidAt": new Date(),
          "payments.commitment.receiptNumber": session.payment_intent as string
        }, { new: true });

        if (updatedOrder) {
          sendOrderConfirmation(
            session.customer_details?.email || updatedOrder.buyer.email,
            updatedOrder.orderNumber,
            session.amount_total!
          ).catch(err => console.error("Email failed:", err));
        }
        console.log(`Payment succeeded for session: ${session.id}`);
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

router.post("/create-checkout-session", async (req, res) => {
  try {
    const { orderItems, formData, buyerId, checkoutSelection } = req.body;

    const variantIds = orderItems.map((item: any) => item.variantId);    
    const dbVariants: LeanArray<IVariant> = await Variant.find({ _id: {$in: variantIds }});

    const variantMap = new Map<string, IVariant>(dbVariants.map((v: IVariant) => [v._id.toString(), v]));

    let totalProductValue = 0;
    const verifiedItems = orderItems.map(( item: any ) => {
      const dbVar = variantMap.get(item.variantId);

      if (!dbVar) throw new Error(`Product variant ${item.variantId} not found`);
      const itemTotal = dbVar.price * item.quantity;
      totalProductValue += itemTotal;

      return {
        variantId: dbVar._id,
        name: item.name,
        price: dbVar.price,
        quantity: item.quantity,
        seller: { sellerId: item.merchantId, storeName: item.merchant },
        deliveryToHub: { status: "pending" }
      };
    });
  
    const commitmentFee = checkoutSelection === "upfront" ? (totalProductValue + shipping) : shipping;
    const balanceDue = checkoutSelection === "upfront" ? 0 : totalProductValue;

    const order = await Order.create({
      orderNumber: `VEN-${nanoid(8).toUpperCase()}`,
      paymentType: checkoutSelection,
      buyer: {
        buyerId: buyerId,
        phone: formData.phone,
        name: `${formData.firstName} ${formData.lastName}`,
        location: {
          county: formData.county,
          constituency: formData.constituency,
          ward: formData.ward
        }
      },
      seller: {
        sellerId: orderItems[0]?.merchantId,
        storeName: orderItems[0]?.merchant,
        isWarehoused: false
      },
      items: verifiedItems,
      financials: {
        totalProductValue,
        commitmentFee,
        balanceDue,
        commisionRate: 0.1,
        platformRevenue: totalProductValue * 0.1,
        sellerPayout: totalProductValue * 0.9
      },
      payments: {
        commitment: { status: "pending" },
        balance: { status: balanceDue === 0 ? "paid" : "pending"}
      },
      status: "awaitingCommitment"
    });

    const session = await stripe.checkout.sessions.create({     
      payment_method_types: ["card"], 
      line_items: [{
        price_data: {
          currency: "KES",
          product_data: {
            name: `Order Purchase: ${order.orderNumber}`,            
          },
          unit_amount: commitmentFee * 100,         
        },
        quantity: 1
      }],
      metadata: {
        orderId: order._id.toString()
      },
      mode: "payment",
      success_url: (`${process.env.FRONTEND}/store/order-status/success/?session_id={CHECKOUT_SESSION_ID}&no=${order.orderNumber}`),
      cancel_url: (`${process.env.FRONTEND}/store`),
      expires_at: Math.floor(Date.now() / 1000) + (30 * 60)
    });

    Order.findByIdAndUpdate(order._id, {
      "payments.commitment.checkoutRequestId": session.id
    }).exec();

    res.json({ url: session.url });
  } catch (err: any) {
    res.status(500).json({ error: err.message})
  }
})

export { router as PaymentRouter };