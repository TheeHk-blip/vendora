"use client";

import { useRouter, useSearchParams } from "next/navigation"
import { Suspense } from "react";
import CheckCircle from "@mui/icons-material/CheckCircle";

const SubscriptionSuccessContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const plan = searchParams.get("plan");

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 text-center">
      <div className="space-y-4 animate-in fade-in zoom-in duration-500">
        <div className="flex flex-row items-center gap-2.5">
          <h1 className="text-3xl font-bold">Payment Confirmed!</h1>
          <CheckCircle className="w-20 h-20 text-green-500 mx-auto" />
        </div>  
        <p>You&apos;ll now enjoy all the benefits of <span className="font-medium text-gray-600 dark:text-gray-400" >{plan?.toUpperCase()}</span> plan.</p>
        <button 
          onClick={() => router.push("/")}
          className="mt-6 px-8 py-3 cursor-pointer active:scale-[0.99] rounded-full bg-gray-500 dark:bg-gray-800 transition"
        >
          Dashboard
        </button>
      </div>    
    </div>
  )
}

export default function SubscriptionStatus() {
  return (
    <Suspense fallback={<div>Loading subscription status</div>}>
      <SubscriptionSuccessContent />
    </Suspense>
  )
}