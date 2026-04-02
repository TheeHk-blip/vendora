"use client";

import { Button, InputField, socket, title, useToast } from "@vendora/ui";
import { useRouter, useSearchParams } from "next/navigation"
import { useState } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";

export default function Payments() {
  const { showToast } = useToast();
  const router = useRouter();
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const plan = searchParams.get("plan")
  const [paymentMethod, setPaymentMethod] = useState<"card" | "mpesa">("card");
  const [loading, setLoading] = useState(false);
  const [phone, setPhone] = useState("");

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true)
    const endpoint = paymentMethod === "card" 
    ? "/create-checkout-session" 
    : "/stk-push";

    try {
      const payload = {      
        phone,
        type: "subscription",
        sellerId: session?.user._id,
        planSlug: plan
      };

      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER}payments${endpoint}`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(payload)
      });

      const result = await response.json();
      if (result.url) {
        window.location.href = result.url;
        return;
      }

      if (response.ok && result.success) {
        const { sellerId, plan, amount } = result;
        showToast("STK Push Sent! Enter your PIN to authorize the transaction", "success");

        socket.emit("join-subscription-room", sellerId);
        router.push(`/subscription/status?id=${plan}&user=${sellerId}&amount=${amount}`);
      } else {
        showToast("Failed to initialize payment. Please try again", "error")
      }
    } catch (error) {
      console.error("Submission failed", error);
      showToast("Something went wrong with the payment request", "error")
    } finally {
      setLoading(false);
    }
  }
  return(
    <div className="flex flex-col justify-center items-center my-10 gap-4 w-full">
      <h2 className={title()} >Choose Payment Method</h2>          
      <form onSubmit={handleSubmit} className="flex flex-col justify-between gap-3.5 w-full">
        <div className="flex flex-row items-center justify-center gap-5 w-full" >
          <div className="flex flex-col gap-2.5 bg-foreground/40 px-4 py-2 rounded-xl w-full" >
            <p>Card</p>
            <Button
              type="button"
              onClick={() => setPaymentMethod("card")}
              className={`h-20 w-full ring-2 flex flex-row ${paymentMethod === "card" ? "ring-green-500": "ring-transparent"}`}
            >
              <Image alt="card image" src="/card.png" width={100} height={100} unoptimized />               
            </Button>
          </div>          
          <div className="flex flex-col bg-foreground/40 gap-2.5 px-4 py-2 rounded-xl w-full" >
            <p>M-Pesa</p>
            <Button
              type="button"
              onClick={() => setPaymentMethod("mpesa")}
              className={`h-20 w-full ring-2 ${paymentMethod === "mpesa" ? "ring-green-500": "ring-transparent"}`}
            >
              <Image alt="mpesa icon" src="/mpesa.png" width={100} height={100} unoptimized />                      
            </Button>
          </div>          
        </div>
        {paymentMethod === "mpesa" &&
          <InputField 
            type="number"
            name="phone"
            label="Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required={true}
          />
        }
        <Button
          color="primary"
          type="submit"
          disabled={loading}
        >
          {loading ? <span className="animate-pulse">Making payment...</span> : "Make payment"}
        </Button>
      </form>
    </div>
  )
  
}