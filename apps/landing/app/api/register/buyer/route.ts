/* eslint-disable @typescript-eslint/no-explicit-any */

import { connectDB } from "@vendora/db";
import Buyer from "@vendora/db/src/models/buyer";
import User from "@vendora/db/src/models/user";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const {name, email, password } = await request.json();

  await connectDB();

  try {
    const existingUser = await User.findOne({ email }).lean();
    if (existingUser) {
      return NextResponse.json({ error: "User already exists"}, {status: 400});
    }

    // create user
    const hashedPassword = password ? await bcrypt.hash(password, 10) : undefined;
    const user = await User.create({
      name,
      email,
      password:hashedPassword,
      role: "buyer"
    });

    //create buyer profile linked to user
    const buyer = await Buyer.create({
      userId: user._id,        
    });

    return NextResponse.json({ user, buyer }, {status: 201});
  } catch (error: any) {
    console.error("Register buyer error:", error)
    return NextResponse.json({ error: error.message}, {status: 400 })
  }
}