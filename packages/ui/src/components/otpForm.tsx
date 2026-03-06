"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { VerifyOtp } from "../actions/verifyOtp";
import { InputField } from "./Input";
import { Button } from "./Button";
import { ResendOtp } from "../actions/resendOtp";
import { useSession } from "next-auth/react";

export function OtpForm({ email }: { email: string}) {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [countdown, setCountdown] = useState(0);
  const [message, setMessage] = useState("");
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();
  const { update } = useSession();

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleVerify = async () => {
    setIsPending(true);
    setError("");

    try {
      const result = await VerifyOtp({email, otp});
      if (result.success) {
        const newSession = await update({ isVerified: true });        
        if (newSession) {
          window.location.href = "/"
        }        
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsPending(false);
    }
  }

  const handleResend = async () => {
    if (countdown > 0) return;

    try {
      await ResendOtp({email});
      setCountdown(60);
      setMessage("New code sent to your inbox!");
    } catch (err: any) {
      setMessage(err.message);
    }
  }

  return (
    <div className="flex flex-col gap-2.5 items-center justify-center" >
      <InputField 
        label="OTP"
        value={otp}
        maxLength={6}
        type="text"
        onChange={(e) => setOtp(e.target.value)}
        placeholder="Enter 6-digit code"
      />
      {error && <p className="text-red-500 text-xs">{error}</p>}
      <Button
        onClick={handleVerify}
        disabled={isPending}
        color="primary"
      >
        {isPending ? <span className="animate-pulse">Verifying...</span> : "Verify Account"}
      </Button>
      <div className="flex flex-col gap-2.5 items-center w-full" >
        <div className="flex flex-row gap-2" >
          <span className="text-center text-gray-600 dark:text-gray-300 mt-4" >Didn&apos;t receive a code?</span>
          <Button
            onClick={handleResend}
            disabled={countdown > 0}
            className={`text-xs mt-4 ${countdown > 0 ? "text-gray-600 dark:text-graay-300" :"text-blue-600"}`}
          >
            { countdown > 0 ? `Resend code in ${countdown}s`: "Resend"}
          </Button>
        </div>
        {message && <p>{message}</p>}
      </div>
    </div>
  )
}