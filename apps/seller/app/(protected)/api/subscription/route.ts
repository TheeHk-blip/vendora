import { authOptions } from "@vendora/auth";
import { connectDB, Plan, Seller, Subscription } from "@vendora/db/frontend";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {    
    const {subPlan} = await request.json();

    await connectDB();
    const usersession = await getServerSession(authOptions);
    const sessionId = usersession?.user._id;
    const user = usersession?.user.name;
    const sellerId = new mongoose.Types.ObjectId(sessionId as string);
    const subscriber = await Seller.findOne({ userId: sellerId });    
    const subscription = await Plan.findOne({ slug: subPlan}, { _id: 1});

    await Promise.all([
      Seller.findOneAndUpdate(
        { userId: sellerId},
        {
          $set: {
            subscription: subPlan,      
            subscriptionId: subscription?._id      
          }
        },
        { upsert: true, new: true, session }
      ),

      subscriber?.subscriptionId ? Subscription.findOneAndUpdate(
        { subscriberId: subscriber?._id, status: "active" },
        {
          $set: {
            status: "expired",
            expiryDate: new Date()
          }
        },
        { session }
      ) : Promise.resolve(),

      Subscription.create(
        [{
          subscriberId: subscriber?._id,
          plan: subscription?._id,
          status: "active",        
          isLifeTime: true
        }],
        { session }
      )
    ].filter(Boolean))

    await session.commitTransaction();
    revalidatePath("/subscription")

    const response = `Plan updated to ${subPlan} for ${user}`; 

    return NextResponse.json({response, subPlan}, { status: 201 });
  } catch (error) {
    await session.abortTransaction();
    console.error("Error updating your plan:", error);
    return NextResponse.json({ error: "Failed to update your plan. Try again later" }, { status: 500 });
  } finally {
    await session.endSession();
  }
}