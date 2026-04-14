"use server";

import { connectDB } from "../../../db/src/connection/client";
import User from "../../../db/src/models/user";

interface EmailProps {
  email: string;
  otp: string;
}

export async function VerifyOtp({ email, otp }: EmailProps) {
  await connectDB();

  const user = await User.findOne({ email });

  if (!user || !user.verificationOtp) {
    throw new Error("User not found or no OTP requested");
  }

  if (new Date() > user.verificationOtp.expiresAt) {
    throw new Error("This code has expired. Please request a new one.");
  }

  if (user.verificationOtp.code !== otp) {
    throw new Error("Invalid verification code");
  }

  user.isVerified = true;  
  await user.save();

  return { success: true};
}