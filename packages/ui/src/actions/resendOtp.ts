"use server";

import { connectDB } from "../../../db/src/connection/client";
import User from "../../../db/src/models/user";
import { sendVerificationEmail } from "./mail";
import { randomInt } from "node:crypto"

interface EmailProps {
  email: string;
}

export async function ResendOtp({ email }: EmailProps) {
  await connectDB();

  const user = await User.findOne({ email });
  if (!user) throw new Error("User not found");

  const now = new Date();
  if (user.verificationOtp.expiresAt && (now.getTime() - user.verificationOtp.expiresAt.getTime() < 60000)) {
    throw new Error("Please wait 60 seconds before requesting a new code");
  }

  const newOtp = randomInt(10000, 50000).toString();
  const expiresAt = new Date(Date.now() + 10 * 60000);

  const updatedUser = await User.findOneAndUpdate(
    { email },
    {
      $set: {
        "verificationOtp.code": newOtp,
        "verificationOtp.expiresAt": expiresAt,
        lastOtpSentAt: new Date()
      }
    },
    { new: true }
  );

  await sendVerificationEmail({email, otp: newOtp});

  return { success: true };
}