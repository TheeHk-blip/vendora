import { Router } from "express";
import { stripe } from "./stripe.config.js";
import axios from "axios";
import { getMpesaAccessToken } from "./mpesa.service.js";
import { Order, Subscription, type IOrder, type ISubscription } from "@vendora/db/backend";
import { preparePaymentData } from "./../helpers/preparePayment.js";



const router: Router = Router();
const getMpesaAuth = () => {
  const timestamp = new Date().toISOString().replace(/[-:T.Z]/g, "").slice(0, 14);
  const password = Buffer.from(
    `${process.env.MPESA_SHORTCODE}${process.env.MPESA_PASSKEY}${timestamp}`
  ).toString("base64");
  return { timestamp, password};
}

router.post("/stk-push", async (req, res) => {
  let order: IOrder | null = null;
  let subscription: ISubscription | null = null;
  try {
    const { orderId, planSlug, type } = req.body;
    const paymentContext = await preparePaymentData(req.body);    

    order = paymentContext.order || null;
    subscription = paymentContext.subscription || null;
    const { amountToPay, phoneNumber, accountReference, transactionDesc }  = paymentContext;       
    const accessToken = await getMpesaAccessToken();
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
        AccountReference: accountReference,
        TransactionDesc: transactionDesc
      },
      { headers: { Authorization: `Bearer ${accessToken}` } },
    );

    const isBalancePayment = !!orderId;
    const updatePath = isBalancePayment ? "payments.balance" : "payments.commitment";
    
    if (type === "subscription" && subscription) {
      await Subscription.findByIdAndUpdate(subscription._id, {
        checkoutRequestId: stkResponse.data.CheckoutRequestID
      });

      if (stkResponse.data.ResponseCode === "0") {
        return res.json({
          success: true,
          message: "STK Push Sent",
          sellerId: subscription.subscriberId,
          plan: planSlug,
          amount: amountToPay,
        })
      }
    } else if (type === "order" && order){
      await Order.findByIdAndUpdate(order._id, {
        [`${updatePath}.checkoutRequestId`]: stkResponse.data.CheckoutRequestID
      });

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
    }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("STK Push Error:", error);    

    if (order && order._id) {
      await Order.findByIdAndUpdate(order._id, {
        status: "rejected",
        "payments.commitment.status": "failed"
      });
    }

    if (subscription && subscription._id) {
      await Subscription.findByIdAndUpdate(subscription._id, {
        status: "failed"
      })
    }

    if (error.name === "ValidationError") {
      console.error("Mongoose Validation Error:", error.message)
      return res.status(400).json({ error: "Internal server error" });
    }

    if (error.response) {
      console.error("Safaricom Error Data:", error.response.data)
      return res.status(503).json({error: "Internal server error"});
    }

    return res.status(500).json({ error: "Internal Server Error"});
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

router.post("/stripe", async (req, res) => {  
  let order:IOrder | null = null;
  let subscription:ISubscription | null = null;
  try {
    const { type, orderId, planSlug } = req.body;
    const paymentContext = await preparePaymentData(req.body);    

    order = paymentContext.order ?? null;
    subscription = paymentContext.subscription ?? null;
    const { amountToPay, transactionDesc } = paymentContext;
    const metadata = {
      type,
      orderId: order?._id.toString() || "",   
      transactionDesc,   
      subscriptionId: subscription?._id.toString() || "",    
      isBalancePayment: (!!orderId).toString()
    };

    let successUrl = "";
    if (type === "subscription") {
      successUrl = `${process.env.SELLER_APP}/subscription/status/success/?session_id={CHECKOUT_SESSION_ID}&plan=${planSlug}`
    } 
    else if (transactionDesc === "Balance Payment") {
      successUrl = `${process.env.STORE_APP}/store/order-status/payments/success/?session_id={CHECKOUT_SESSION_ID}&no=${order?.orderNumber}`
    }     
     else {
      successUrl =`${process.env.STORE_APP}/store/order-status/success/?session_id={CHECKOUT_SESSION_ID}&no=${order?.orderNumber}`
    }
              
    const session = await stripe.checkout.sessions.create({     
      payment_method_types: ["card"], 
      line_items: [{
        price_data: {
          currency: "KES",
          product_data: {
            name: `${transactionDesc}`,            
          },
          unit_amount: amountToPay * 100,         
        },
        quantity: 1
      }],
      metadata,
      mode: "payment",
      success_url: successUrl,
      cancel_url: type === "subscription"
        ? `${process.env.SELLER_APP}/subscription`
        : `${process.env.STORE_APP}/store`,
      expires_at: Math.floor(Date.now() / 1000) + (30 * 60)
    });

    if (type === "subscription") {
      await Subscription.findByIdAndUpdate(subscription?._id, {checkoutRequestId: session.id});
    } else {
      await Order.findByIdAndUpdate(order?._id, {
        "payments.commitment.checkoutRequestId": session.id
      });
    }

    res.json({ url: session.url });
  } catch (error) {
    console.error("Internal server error:", error);
    if (order && order._id) {
      await Order.findByIdAndUpdate(order._id, {
        status: "rejected",
        "payments.commitment.status": "failed"
      });
    }

    if (subscription && subscription._id) {
      await Subscription.findByIdAndUpdate(subscription._id, {
        status: "failed"
      })
    }
    res.status(500).json({ error: "Internal server error"});
  }
})

export { router as PaymentRouter };