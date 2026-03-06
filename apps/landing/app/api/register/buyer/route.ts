/* eslint-disable @typescript-eslint/no-explicit-any */

import { connectDB, Buyer, User } from "@vendora/db";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import crypto from "crypto";
import { sendVerificationEmail } from "@vendora/ui/src/actions/mail";

export async function POST(request: Request) {
  const {name, email, password } = await request.json();

  await connectDB();

  try {
    const existingUser = await User.findOne({ email }).lean();
    if (existingUser) {
      return NextResponse.json({ error: "User already exists"}, {status: 400});
    }

    const otp = crypto.randomInt(100000, 999999).toString();
    const expiresAt = new Date(Date.now() + 10 * 60000);

    // create user
    const hashedPassword = password ? await bcrypt.hash(password, 10) : undefined;
    const user = await User.create({
      name,
      email,
      password:hashedPassword,
      verificationOtp: { code: otp, expiresAt},
      role: "buyer"
    });

    await sendVerificationEmail({email:user.email, otp});

    //create buyer profile linked to user
    const buyer = await Buyer.create({
      userId: user._id,        
    });

    return NextResponse.json({ user, buyer, success: true }, {status: 201});
  } catch (error: any) {
    console.error("Register buyer error:", error)
    return NextResponse.json({ error: error.message}, {status: 400 })
  }
}