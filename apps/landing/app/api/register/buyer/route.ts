import { connectDB } from "@vendora/db";
import User from "@vendora/db/src/models/users";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";


export async function POST(request: Request) {
  try {
    const { fullName, email, password } = await request.json();

    if (!fullName || !email || !password) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400})
    }

    await connectDB();

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 400})
    }

    let hashedPassword  = undefined;

    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    const newUser = await User.create({
      name: fullName,
      email,
      password: hashedPassword,
      role: "buyer"
    });

    return NextResponse.json({ message: "User registered successfully", userId: newUser._id }, { status: 201});

  } catch (error) {
    console.error("Error registering user:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}