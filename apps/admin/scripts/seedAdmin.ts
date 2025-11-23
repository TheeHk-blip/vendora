import mongoose from "mongoose";
import User from "@vendora/db/src/models/user";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import dotenv from "dotenv";

dotenv.config();

async function SeedAdmin() {
  try {
    const MONGO_URI = process.env.MONGODB_URI as string;
    if (!MONGO_URI) throw new Error ("MONGO URI not defined");

    await mongoose.connect(MONGO_URI);

    const existingAdmin = await User.findOne({ email: process.env.ADMIN_EMAIL });
    if (existingAdmin) {
      console.log("Admin already exists");
      return;
    }

    const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD!, 10)
    const admin = await User.create({
      name: process.env.ADMIN_NAME,
      email: process.env.ADMIN_EMAIL,
      password: hashedPassword,
      role: "admin"
    });

    return NextResponse.json({ admin }, {status: 201});

  } catch (error) {
    console.error("Failed to seed admin:", error)
  } finally {
    await mongoose.disconnect();
  }
}

SeedAdmin().catch(console.error);