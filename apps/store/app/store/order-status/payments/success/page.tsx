"use client";

import { CheckCircle } from "@mui/icons-material";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get("no");

  return(
    <div className="flex flex-col items-center justify-center h-dvh space-y-4 animate-in fade-in zoom-in duration-500">   
      <div className="flex flex-row items-center gap-2.5">
        <h1 className="text-3xl font-bold">Payment Confirmed!</h1>
        <CheckCircle className="w-20 h-20 text-green-500 mx-auto" />
      </div>         
      <p>Your order <strong>{orderNumber}</strong> has been marked as fully paid. Thank you for Shopping with US.</p>      
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