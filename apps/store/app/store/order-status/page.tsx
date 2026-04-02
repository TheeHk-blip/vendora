"use client";

import { ArrowBack, CheckCircle } from "@mui/icons-material";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import Image from "next/image";
import { socket } from "@/app/utilities/socket";
import { Button, useToast } from "@vendora/ui";
import { cartStore } from "@/app/cart/cartStore";
import PriceDisplay from "@vendora/ui/src/components/priceDisplay";

const OrderStatusContent = () => {
  const router = useRouter();
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

  const handleCancel = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER}payments/cancel-order`, {
      method: "POST",
      headers: { "Content-Type": "application/json"},
      body: JSON.stringify({ orderId })
    });

    if (res.ok) {
      showToast("Order cancelled", "info");
      router.push("/store");
    }
  };

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
          <div className="my-2.5 bg-foreground/30 px-4 py-2 rounded-lg">
            <span className="text-gray-600 dark:text-gray-400">STK Push not showing?</span>
            <div className="flex flex-row justify-between mt-1">              
              <Button
                color="primary"
                type="button"
                onClick={() => router.push("/store/checkout")}
              >
                <ArrowBack />
                Checkout
              </Button>
              <Button 
                type="button"
                color="danger"
                onClick={handleCancel}
              >
                Cancel Order
              </Button>
            </div>
          </div>                  
        </div>
      ) : (
        <div className="space-y-4 animate-in fade-in zoom-in duration-500">
          <div className="flex flex-row items-center gap-2.5">
            <h1 className="text-3xl font-bold">Payment Confirmed!</h1>
            <CheckCircle className="w-20 h-20 text-green-500 mx-auto" />
          </div>                    
          <p>Your order <strong>{orderNo}</strong> is now being processed.</p>
          <button 
            onClick={() => router.push("/orders")}
            className="mt-6 px-8 py-3 cursor-pointer active:scale-[0.99] rounded-full bg-gray-500 dark:bg-gray-800 transition"
          >
            Track My Order
          </button>
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