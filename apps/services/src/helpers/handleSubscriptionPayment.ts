import { Plan, Seller, Subscription, type ISubscription } from "@vendora/db/*";
import type { Request } from "express";
import mongoose from "mongoose";

export async function handleSubscriptionPayment(sub: ISubscription, receipt: string, req: Request) {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    let updateSub;
    const now = new Date();  
    const currentExpiry = sub.expiryDate && sub.expiryDate > new Date()
      ? new Date(sub.expiryDate)
      : new Date();

    const newExpiry = new Date(currentExpiry);
    newExpiry.setDate(newExpiry.getDate() + 29);

    switch (sub.status) {
      case "upgraded":
        try {
          const oldSub = await Subscription.findOne({
            subscriberId: sub.subscriberId,
            status: "upgraded"
          }). populate([{ path: "plan", model: "Plan", select: "price slug"}]);

          const newSub = await Plan.findById(sub.metadata.upgradeId);

          let bonusDays = 0;
          const finalExpiry = new Date();
          finalExpiry.setDate(finalExpiry.getDate() + 29);
          if (oldSub && (sub.metadata).action === "upgrade") {
            const oldPrice = (oldSub.plan).price || 0;
            const newPrice = newSub.price || 1;
            const remainingDays = Math.max(0, (oldSub.expiryDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));

            bonusDays = Math.floor((remainingDays * oldPrice) / newPrice);            
            finalExpiry.setDate(newExpiry.getDate() + bonusDays);
          }
          
          await Subscription.updateMany(
            { subscriberId: sub.subscriberId, status: "upgraded" },
            { $set: { expiryDate: now }},
            { session }
          );

          const [upgradedSub] = await Subscription.create(
            [{
              subscriberId: sub.subscriberId,
              status: "active",
              plan: sub.metadata.upgradeId,
              receiptNumber: receipt,
              startDate: now,
              expiryDate: finalExpiry,
              "metadata.bonusDays": bonusDays
            }],
            { session }
          );

          updateSub = await Subscription.findById(upgradedSub._id)
            .populate([
              { path: "plan", model: "Plan", select: "slug" }              
            ])
            .session(session);
        } catch (error) {
          console.error("Error upgrading your plan:", error)
        }
      break;

      case "renewed":
        try {
          await Subscription.updateMany(
            { subscriberId: sub.subscriberId, status: "renewed" },
            { $set: { expiryDate: now }},
            { session }
          );

          const [renewedSub] = await Subscription.create(
            [{
              subscriberId: sub.subscriberId,
              status: "active",
              plan: sub.plan,
              receiptNumber: receipt,
              startDate: now,
              expiryDate: newExpiry
            }],
            { session }
          );

          updateSub = await Subscription.findById(renewedSub._id)
            .populate([
              { path: "plan", model: "Plan", select: "slug"}
            ])
            .session(session);
       } catch (error) {
          console.error("Failed to renew subscription:", error);         
       }
      break;
      
      case "pending":
        updateSub = await Subscription.findByIdAndUpdate(
          sub._id, 
          {
            $set: {
              status: "active",
              receiptNumber: receipt,
              paidAt: new Date(),
              expiryDate: newExpiry,
            }
          },
          { session, new: true }
        )
        .populate([
          {
            path: "plan",
            model: "Plan",
            select: "slug"
          }
        ]);
    };

    if (!updateSub || !updateSub.plan) {
      throw new Error("Subscription or Plan details missing after update.");
    }

    const sellerId = new mongoose.Types.ObjectId(sub.subscriberId as string)
    await Seller.findOneAndUpdate(
      {userId: sellerId}, 
      {
        $set: {
          subscriptionId: updateSub._id,
          subscription: (updateSub.plan).slug,
        }
      },
      { session }
    );

    await session.commitTransaction();

    const io = req.app.get("io");
    io.to(sub.subscriberId.toString()).emit("subscription-status", {
      status: "active",
      receipt: receipt
    })

  } catch (error) {
    await session.abortTransaction();
    console.error("Callback Processing Error:", error);
  } finally {
    await session.endSession();
  }        
}

