import { NextResponse } from "next/server";
import { connectDB, User, Seller, Subscription, Plan } from "@vendora/db/frontend";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { sendVerificationEmail } from "@vendora/ui/src/actions/mail";
import mongoose from "mongoose";

export async function POST(request: Request) {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { name, businessName, email, password } = await request.json();

    await connectDB();

    const existingUser = await User.findOne({ email }).lean();

    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 400})
    }

    const otp = crypto.randomInt(100000, 999999).toString();
    const expiresAt = new Date(Date.now() + 10 * 60000);

    // create user
    const hashedPassword = password ? await bcrypt.hash(password, 10) : undefined;
    const [user] = await User.create(
      [{
        name,
        email,
        password: hashedPassword,
        verificationOtp: { code: otp, expiresAt},      
        role: "seller",      
      }],   
      { session }  
    );

    // create seller profile  
    const plan = await Plan.findOne({ slug: "basic" }, {_id: 1});
    const expiry = new Date();
    expiry.setFullYear(expiry.getFullYear() + 100);

    const [subscription] = await Subscription.create(
      [{
        subscriberId: user._id,
        plan: plan?._id,
        status: "active",
        isLifeTime: true,
        expiryDate: expiry,
      }],
      { session }
    );

    await Seller.create(
      [{
        userId: user._id,
        businessName: businessName,  
        subscriptionId: subscription._id
      }],
      { session }
    );

    await session.commitTransaction();

    await sendVerificationEmail({email: user.email, otp});       
    
    return NextResponse.json({ success: true }, { status: 201});

  } catch (error) {
    await session.abortTransaction();
    console.error("Error registering seller:", error);
    return NextResponse.json({"Error registering seller": error }, { status: 400 });
  } finally {
    await session.endSession()
  }
}

