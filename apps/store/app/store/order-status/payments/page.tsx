"use client";

import { CheckCircle } from "@mui/icons-material";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import Image from "next/image";
import { socket } from "@/app/utilities/socket";
import { useToast } from "@vendora/ui";
import { cartStore } from "@/app/cart/cartStore";
import PriceDisplay from "@vendora/ui/src/components/priceDisplay";

const OrderStatusContent = () => {  
  const { showToast } = useToast();
  const searchParams = useSearchParams();
  const [isPaid, setIsPaid] = useState(false);

  const orderId = searchParams.get("id");
  const orderNo = searchParams.get("no");
  const amount = searchParams.get("amt");

  useEffect(() => {
    if (orderId) {  
      socket.emit("join-order-room", orderId);
      socket.on("payment-status", (data) => {
        if (data.status === "paid") {
          setIsPaid(true);
          cartStore.clearCart();
          showToast("Payment successful!", "success");
        }
      });
    }

    return () => {
      socket.off("payment-status");  
    }
  }, [orderId, showToast]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 text-center">
      {!isPaid ? (
        <div>
          <Image alt={"vendora icon"} src={"/brand.png"} width={100} height={100} className="animate-pulse mx-auto" />
          <h1 className="text-2xl font-bold">Processing Payment...</h1>   
          <div className="text-start flex flex-col">
            <span className="text-gray-600 dark:text-gray-400">Kindly enter your M-Pesa PIN</span>    
            <span className="text-gray-600 dark:text-gray-400">Order Number: {orderNo}</span>
            <span className="text-gray-600 dark:text-gray-400">Order Total: <PriceDisplay amount={Number(amount)} /></span>
          </div>                                  
        </div>
      ) : (
        <div className="flex flex-col items-center space-y-4 animate-in fade-in zoom-in duration-500">
          <div className="flex flex-row items-center gap-2.5">
            <h1 className="text-3xl font-bold">Payment Confirmed!</h1>
            <CheckCircle className="w-20 h-20 text-green-500 mx-auto" />
          </div>                    
          <p>Your order <strong>{orderNo}</strong> has been marked as fully paid. Thank you for shopping with US!</p>         
        </div>
      )}
    </div>
  )
}

export default function OrderStatus() {
  return (
    <Suspense fallback={<div>Loading order status...</div>}>
      <OrderStatusContent />
    </Suspense>
  )
}