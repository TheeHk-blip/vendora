/* eslint-disable @typescript-eslint/no-explicit-any */

import { NextResponse } from "next/server";
import { connectDB } from "@vendora/db";
import User from "@vendora/db/src/models/user";
import Seller from "@vendora/db/src/models/seller";
import bcrypt from "bcryptjs";


export async function POST(request: Request) {
  try {
    const { name, businessName, email, password } = await request.json();

    await connectDB();

    const existingUser = await User.findOne({ email }).lean();

    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 400})
    }

    // create user
    const hashedPassword = password ? await bcrypt.hash(password, 10) : undefined;
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "seller",
    });

    // create seller profile
    const seller = await Seller.create({
      userId: user._id,
      businessName: businessName
    })

    return NextResponse.json({ user, seller }, { status: 201});

  } catch (error: any) {
    console.error("Error registering seller:", error);
    return NextResponse.json({ error: error.message || "Something went wrong" }, { status: 400 });
  }
}