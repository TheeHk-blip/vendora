import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import User from "@vendora/db/src/models/user";


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

    console.log("Seeded Admin:", admin.email)

  } catch (error) {
    console.error("Failed to seed admin:", error)
  } finally {
    await mongoose.disconnect();
  }
}

SeedAdmin().catch(console.error);