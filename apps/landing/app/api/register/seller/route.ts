/* eslint-disable @typescript-eslint/no-explicit-any */

import { NextResponse } from "next/server";
import { connectDB, User, Seller } from "@vendora/db";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { sendVerificationEmail } from "@vendora/ui/src/actions/mail";

export async function POST(request: Request) {
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
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      verificationOtp: { code: otp, expiresAt},      
      role: "seller",      
    });

    await sendVerificationEmail({email:user.email, otp});

    // create seller profile
    const seller = await Seller.create({
      userId: user._id,
      businessName: businessName
    })
    
    return NextResponse.json({ user, seller, success: true }, { status: 201});

  } catch (error: any) {
    console.error("Error registering seller:", error);
    return NextResponse.json({ error: error.message || "Something went wrong" }, { status: 400 });
  }
}

