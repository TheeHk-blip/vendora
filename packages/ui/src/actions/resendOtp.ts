"use server";

import { connectDB } from "../../../db/src/connection/client";
import User from "../../../db/src/models/user";
import crypto from "crypto";
import { sendVerificationEmail } from "./mail";

interface EmailProps {
  email: string;
}

export async function ResendOtp({ email }: EmailProps) {
  await connectDB();

  const user = await User.findOne({ email });
  if (!user) throw new Error("User not found");

  const now = new Date();
  if (user.lastOtpSentAt && (now.getTime() - user.lastOtpSentAt.getTime() < 60000)) {
    throw new Error("Please wait 60 seconds before requesting a new code");
  }

  const newOtp = crypto.randomInt(100000, 999999).toString();
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