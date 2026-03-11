"use client";

import { CheckCircle } from "@mui/icons-material";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderNumber = searchParams.get("no");

  return(
    <div className="flex flex-col items-center justify-center mt-10 space-y-4 animate-in fade-in zoom-in duration-500">   
      <div className="flex flex-row items-center gap-2.5">
        <h1 className="text-3xl font-bold">Payment Confirmed!</h1>
        <CheckCircle className="w-20 h-20 text-green-500 mx-auto" />
      </div>         
      <p>Your order <strong>{orderNumber}</strong> is now being processed.</p>
      <button 
        onClick={() => router.push('/orders')}
        className="mt-6 px-8 py-3 rounded-full bg-gray-500 dark:bg-gray-800 transition"
      >
        Track My Order
      </button>
    </div>
  )
}

export default function OrderSuccess() {
  return(
    <Suspense fallback={<div>Loading your order status...</div>}>
      <OrderSuccessContent />
    </Suspense>
  )
}