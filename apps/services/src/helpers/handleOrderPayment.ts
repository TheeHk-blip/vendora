import { Order, startOrderLifeCycle, type IOrder } from "@vendora/db";
import type { Request } from "express";
import { sendOrderConfirmation } from "src/payments/email.services.js";

export async function handleOrderPayment(order: IOrder, checkoutId: string, receipt: string, req: Request) {
  const isCommitment = order.payments.commitment.checkoutRequestId === checkoutId;
  let updatePath = null;
  if (order.payments.balance.checkoutRequestId === checkoutId) {
    updatePath = "payments.balance";
  } else if (order.payments.commitment.checkoutRequestId === checkoutId) {
    updatePath = "payments.commitment";
  }
  
  const updatedOrder = await Order.findOneAndUpdate(
    { 
      _id: order._id ,
      [`${updatePath}.status`]: { $ne: "paid"}
    },
    {
      $set: {
        [`${updatePath}.status`]: "paid",
        [`${updatePath}.receiptNumber`]: receipt,
        [`${updatePath}.paidAt`]: new Date(),      
        ...(isCommitment && { status: "awaitingDispatch", lifeCycleStarted: true}),
        ...(!isCommitment && { "financials.balanceDue": 0})  
      }
    },
    { new: true }
  );

  if (!updatedOrder) return console.log("Order already processed");    
  if (isCommitment) {
    await startOrderLifeCycle(updatedOrder._id.toString(), updatedOrder.buyer.buyerId.toString());
  }

  const io = req.app.get("io");
  io.to(updatedOrder._id.toString()).emit("payment-status", {
    status: "paid",
    receipt: receipt
  });
      
  if (updatedOrder && updatedOrder.buyer.email) {
    const amountPaid = isCommitment
      ? updatedOrder.financials.commitmentFee
      : updatedOrder.financials.balanceDue;

    await sendOrderConfirmation(
      updatedOrder.buyer.email,
      updatedOrder.orderNumber,
      amountPaid
    ).catch(err => console.error("Email failed:", err));    
  }    
}