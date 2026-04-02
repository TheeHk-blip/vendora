"use client";

import { socket, useToast } from "@vendora/ui";
import { useRouter, useSearchParams } from "next/navigation"
import { Suspense, useEffect, useState } from "react";
import Image from "next/image";
import CheckCircle from "@mui/icons-material/CheckCircle";
import PriceDisplay from "@vendora/ui/src/components/priceDisplay";

const SubscriptionStatusContent = () => {
  const router = useRouter();
  const { showToast } = useToast();
  const searchParams = useSearchParams();
  const [isPaid, setIsPaid] = useState(false);

  const plan = searchParams.get("id");
  const sellerId = searchParams.get("user");
  const amount = searchParams.get("amount");

  useEffect(() => {
    if (sellerId) {
      socket.emit("join-subscription-room", sellerId);
      socket.on("subscription-status", (data) => {
        if (data.status === "active") {
          setIsPaid(true);
          showToast("Payment successful!", "success");
        }
      });
    }

    return () => {
      socket.off("subscription-status")
    }
  }, [sellerId, showToast]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 text-center">
      {!isPaid ? (
        <div>
          <Image alt={"vendora icon"} src={"/brand.png"} width={100} height={100} className="animate-pulse mx-auto" unoptimized loading="eager"/>
          <h1 className="text-2xl font-bold">Processing Payment...</h1>  
          <div className="text-start flex flex-col">
            <span className="text-gray-600 dark:text-gray-400">Kindly enter your M-Pesa PIN</span>                
            <span className="text-gray-600 dark:text-gray-400">Subscription Price: <PriceDisplay amount={Number(amount)} /></span>
          </div> 
        </div>
      ):(
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
      )}
    </div>
  )
}

export default function SubscriptionStatus() {
  return (
    <Suspense fallback={<div>Loading subscription status</div>}>
      <SubscriptionStatusContent />
    </Suspense>
  )
}