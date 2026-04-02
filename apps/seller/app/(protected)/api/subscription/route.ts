import { authOptions } from "@vendora/auth";
import { connectDB, Plan, Seller, Subscription } from "@vendora/db";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {    
    const {subPlan} = await request.json();
    console.log("Plan:", subPlan)

    await connectDB();
    const usersession = await getServerSession(authOptions);
    const sessionId = usersession?.user._id;
    const user = usersession?.user.name;
    const sellerId = new mongoose.Types.ObjectId(sessionId as string);

    const subscription = await Plan.findOne({ slug: subPlan}, { _id: 1});

    await Promise.all([
      Seller.findOneAndUpdate(
        { userId: sellerId},
        {
          $set: {
            subscription: subPlan,            
          }
        },
        { upsert: true, new: true, session }
      ),

      Subscription.findOneAndUpdate(
        { subscriberId: sellerId, status: "active" },
        {
          $set: {
            status: "expired",
            expiryDate: new Date()
          }
        },
        { session }
      ),

      Subscription.create(
        [{
          subscriberId: sellerId,
          plan: subscription._id,
          status: "active",        
          isLifeTime: true
        }],
        { session }
      )
    ])

    await session.commitTransaction();

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