import express, { Router, type Request, type Response } from "express";
import Stripe from "stripe";
import { stripe } from "./stripe.config.js";
import { Buyer, Order, Plan, Subscription, Variant, type IOrder, type ISubscription, type IVariant, type LeanArray } from "@vendora/db";
import { nanoid } from "nanoid";
import axios from "axios";
import { sendOrderConfirmation } from "./email.services.js";
import { getMpesaAccessToken } from "./mpesa.service.js";
import { handleSubscriptionPayment } from "src/helpers/handleSubscriptionPayment.js";
import { handleOrderPayment } from "src/helpers/handleOrderPayment.js";

interface PaymentMetadata {
  type: "order" | "subscription";
  orderId?: string;
  subscriptionId?: string;
  sellerId?: string;
}

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
  let order: IOrder = null;
  let subscription: ISubscription = null;
  let phoneNumber: string = "";       
  let amountToPay: number = 0;
  let accountReference: string = "VendoraPay";
  let transactionDesc: string = "Online Purchase";

  try {
    const { 
      type = "order", 
      formData, 
      orderItems, 
      buyerId, 
      orderId, 
      buyerEmail, 
      checkoutSelection, 
      planSlug, 
      sellerId, 
      phone 
    } = req.body;  
      
    switch (type) {      
      case "subscription":        
        try {                    
          const plan = await Plan.findOne({ slug: planSlug});
          if (!plan) throw new Error("Invalid plan selected");

          phoneNumber = formatPhoneNumber(phone);          
          amountToPay = plan.price;
          accountReference = `SUB-${plan.slug.toUpperCase()}`;
          transactionDesc = `Vendora ${plan.name} Subscription`;  

          const existingSub = await Subscription.findOne({ subscriberId: sellerId, status: "active" })
            .populate([
              {
                path: "plan",
                model: "Plan",
                select: "slug"
              }
            ]); 
          const isRenewal = existingSub && existingSub.plan.slug === planSlug;
          
          if (existingSub) {
            if (isRenewal) {                       
              subscription = await Subscription.findOneAndUpdate(
                { _id: existingSub._id, status: "active" },
                {$set: { status: "renewed", plan: plan._id }},
                { new: true }
              );
            } else {
              subscription = await Subscription.findOneAndUpdate(
                { _id: existingSub._id, status: "active" },
                {$set: { status: "upgraded", metadata: { upgradeId: plan._id, action: "upgrade" } }},
                { new: true }
              )
            }    
          } else {
            subscription = await Subscription.create({
              subscriberId: sellerId,
              plan: plan._id,
              status: "pending"
            }) 
          }
                               
        } catch (error) {          
          console.error("Couldn't initiate payment", error)
          return res.status(500).json({ error: "Payment initialization failed"});
        }
      break;

      case "order":
        try {
          if (orderId) {
            order = await Order.findById(orderId);
            if (!order) throw new Error("Order not found");

            phoneNumber = formatPhoneNumber(order.buyer.phone);      
            amountToPay = order.financials.balanceDue;      
          } else {
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

            const variantIds = orderItems.map((item: IVariant) => item.variantId);  
            const dbVariants = await Variant.find({ _id: {$in: variantIds }}).lean<IVariant[]>();
            const variantMap = new Map<string, IVariant>(dbVariants.map((v: IVariant) => [v._id.toString(), v])); 
            let totalProductValue = 0;    
            let balanceDue: number;  

            const stockUpdates = orderItems.map((item: IVariant) => ({
              updateOne: {
                filter: { _id: item.variantId, stock: { $gte: item.quantity }},
                update: { $inc: { stock: -item.quantity }}
              }
            }));

            await Variant.bulkWrite(stockUpdates);

            const verifiedItems = orderItems.map(( item: IVariant ) => {
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

            phoneNumber = formatPhoneNumber(formData.phone);
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
                  status: balanceDue === 0 ? "paid" : "pending"
                }
              },
              status: "awaitingCommitment"
            });
          }
        } catch (error) {
          console.error("Payment processing failed", error)
        }        
      break;
    }

    const accessToken = await getMpesaAccessToken();
    const { timestamp, password } = getMpesaAuth();
    const isBalancePayment = !!orderId;
    const updatePath = isBalancePayment ? "payments.balance" : "payments.commitment";

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

    if (type === "subscription" && subscription) {
      Subscription.findByIdAndUpdate(subscription._id, {
        checkoutRequestId: stkResponse.data.CheckoutRequestID
      }).exec();

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
      Order.findByIdAndUpdate(order._id, {
        [`${updatePath}.checkoutRequestId`]: stkResponse.data.CheckoutRequestID
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

router.post("/callback", async (req, res) => {
  res.json({  ResultCode: 0, ResultDesc: "Success"});

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
      const metadata = session.metadata as unknown as PaymentMetadata;

      if (!metadata) return res.status(400).send("No metadata found");

      const { type, orderId, subscriptionId } = metadata;

      if (type === "subscription") {
        const sub = await Subscription.findById(subscriptionId);
        await handleSubscriptionPayment(sub, session.id, req);
      } else {
        const order = await Order.findById(orderId);
        await handleOrderPayment(order, session.id, session.id, req);
      }
      
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
  let order: IOrder = null;
  let subscription: ISubscription = null;
  let amountInKes = 0;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let metadata: any = {};
  let successUrl = "";
  let cancelUrl = "";
  let productName = "";
  try {
    const { type = "order", orderItems, orderId, formData, buyerId, checkoutSelection, planSlug, sellerId } = req.body;

    switch (type) {
      case "subscription":
        try {
          const plan = await Plan.findOne({ slug: planSlug });
          if (!plan) throw new Error("Invalid Plan Selected");

          amountInKes = plan.price;
          productName = `Vendora ${plan.name} Subscription`;
          successUrl = `${process.env.SELLER_APP}/`;
          cancelUrl = `${process.env.SELLER_APP}/subscription`;

          const existingSub = await Subscription.findOne({ subscriberId: sellerId, status: "active" })
            .populate([
              {
                path: "plan",
                model: "Plan",
                select: "slug"
              }
            ]); 
          const isRenewal = existingSub && existingSub.plan.slug === planSlug;
          
          if (existingSub) {
            if (isRenewal) {                       
              subscription = await Subscription.findOneAndUpdate(
                { _id: existingSub._id, status: "active" },
                {$set: { status: "renewed", plan: plan._id }},
                { new: true }
              );
            } else {
              subscription = await Subscription.findOneAndUpdate(
                { _id: existingSub._id, status: "active" },
                {$set: { status: "upgraded", metadata: { upgradeId: plan._id, action: "upgrade" } }},
                { new: true }
              )
            }    
          } else {
            subscription = await Subscription.create({
              subscriberId: sellerId,
              plan: plan._id,
              status: "pending"
            }) 
          }

          metadata = {
            type: "subscription",
            subscriptionId: subscription._id.toString(),
            sellerId: sellerId.toString()
          }          
        } catch (error) {
          console.error("Payment failed initialize payment:", error);
          return res.status(500).json({ error: "Failed to initialize payment. Please try again later"})
        }

      break;

      case "order":
        try {
          if (orderId) {
            order = await Order.findById(orderId);
            if (!order) throw new Error("Order not found");            
            amountInKes = order.financials.balanceDue;
          } else {
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
              { new: true, setDefaultOnInsert: true }
            ).exec();

            const variantIds = orderItems.map((item: IVariant) => item.variantId);    
            const dbVariants: LeanArray<IVariant> = await Variant.find({ _id: {$in: variantIds }});   
            
            const variantMap = new Map<string, IVariant>(dbVariants.map((v: IVariant) => [v._id.toString(), v]));

            let totalProductValue = 0;  

            const stockUpdates = orderItems.map((item: IVariant) => ({
              updateOne: {
                filter: { _id: item.variantId, stock: { $gte: item.quantity }},
                update: { $inc: { stock: -item.quantity }}
              }
            }));

            await Variant.bulkWrite(stockUpdates);

            const verifiedItems = orderItems.map((item: IVariant) => {
              const dbVar = variantMap.get(item.variantId);

              if (!dbVar) throw new Error(`Product variant ${item.variantId} not found`);
              const itemTotal = dbVar.price * item.quantity;
              totalProductValue += itemTotal;                        

              return {
                variantId: dbVar._id,
                name: item.name,
                price: dbVar.price,
                quantity: item.quantity,
                seller: { sellerId: item.merchantId, storeName: item.merchant }
              }
            });

            const commitmentFee = checkoutSelection === "upfront" ? (totalProductValue + shipping) : shipping;
            const balanceDue = checkoutSelection === "upfront" ? 0 : totalProductValue;

            order = await Order.create({
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
          }                                                                                           

          amountInKes = order.financials.commitmentFee;
          productName = `Order Purchase: ${order.orderNumber}`;
          successUrl = `${process.env.STORE_APP}/store/order-status/success/?session_id={CHECKOUT_SESSION_ID}&no=${order.orderNumber}`;
          cancelUrl = `${process.env.STORE_APP}/store`;

          metadata = {
            type: "order",
            orderId: order._id.toString()
          }

        } catch (error) {
          console.error("Failed to initalize payment:", error);
          res.status(500).json({ error: "Payment initialization error" });
        }
      
      break;
    }
              
    const session = await stripe.checkout.sessions.create({     
      payment_method_types: ["card"], 
      line_items: [{
        price_data: {
          currency: "KES",
          product_data: {
            name: `Order Purchase: ${productName}`,            
          },
          unit_amount: amountInKes * 100,         
        },
        quantity: 1
      }],
      metadata,
      mode: "payment",
      success_url: successUrl,
      cancel_url: cancelUrl,
      expires_at: Math.floor(Date.now() / 1000) + (30 * 60)
    });

    if (type === "subscription") {
      Subscription.findByIdAndUpdate(subscription._id, {checkoutRequestId: session.id}).exec();
    } else {
      Order.findByIdAndUpdate(order?._id, {
        "payments.commitment.checkoutRequestId": session.id
      }).exec();
    }

    res.json({ url: session.url });
  } catch (error) {
    console.error("Internal server error:", error);
    res.status(500).json({ error: "Internal server error"});
  }
})

export { router as PaymentRouter };