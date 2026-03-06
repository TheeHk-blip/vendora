"use client";

import { cartStore, useCart } from "@/app/cart/cartStore";
import { getTailwindSizes } from "@vendora/ui/src/utilities/image-helper";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useToast } from "@vendora/ui/src/context/toastContext";
import { Shipping } from "./components/shipping";
import { OrderSummary } from "./components/orderSummary";
import { useRouter } from "next/navigation";

export interface CheckoutProps {
  firstName: string;
  lastName: string;
  county: string;
  subCounty: string;
  constituency: string;
  ward: string;
  phone: string;  
}

export default function Checkout() {
  const items = useCart();
  const { showToast } = useToast();
  const { data:  session } = useSession();
  const router = useRouter()
  const [paymentMethod, setPaymentMethod ] = useState<"card" | "mpesa">("card");
  const [checkoutSelection, setCheckoutSelection ] = useState<"upfront" | "partial">("upfront");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData ] = useState<CheckoutProps>({
    firstName: "",
    lastName: "",
    county: "",
    subCounty: "",
    constituency: "",
    ward: "",
    phone: "",
  })

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  if(!items) return;
  const sizes = getTailwindSizes({
      xl: "100vw",
      lg: "100vw",
      md: "50vw",
      xs: "50vw",
      default: "100vw"
  });

  const shipping = 250;
  const subTotal = (items ?? []).reduce((acc, item) => {
    return acc + (Number(item?.price || 0) * Number(item?.quantity || 0));
  }, 0);
  const total = subTotal + shipping;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    if (!session) {
      showToast("Sign In before checking out. Redirecting to sign in page", "error");
      router.push(`${process.env.NEXT_PUBLIC_BASE_URL}/signin`);
    };

    const endpoint = paymentMethod === "card" 
    ? "/create-checkout-session" 
    : "/stk-push";

    const currentItems = Array.isArray(items) ? items: [];
    if (currentItems.length === 0) {
      showToast("Your cart is empty", "error");
      return;
    }

    const userSession = session?.user?._id; 

    try {
      const orderItems = currentItems
      .filter((item) => item !== null && item !== undefined)
      .map((item) => ({        
        variantId: item.variantId || "",
        quantity: Number(item.quantity || 0),
        merchant: item.sellerInfo?.businessName || "unknown",
        merchantId: item.sellerInfo?._id || ""
      }));     

      const payload = {
        formData,
        orderItems,
        buyerId: userSession,
        shipping,        
        checkoutSelection
      };

      const response = await fetch(`http://localhost:3005/payments${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const result = await response.json();
      if (result.ok) {
        showToast("Payment successful")
      }

      if (result.url) {
        cartStore.clearCart();
        window.location.href = result.url;
      } else {
        showToast(`Error: ${result.error}`, "error");
      }      

    } catch (error) {
      console.error("Submission failed", error);
      showToast("Something went wrong with the payment request", "error")
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-10 justify-center w-full">
      <Shipping 
        formData={formData} 
        setFormData={setFormData} 
        paymentMethod={paymentMethod}  
        setPaymentMethod={setPaymentMethod}
        checkoutSelection={checkoutSelection}
        setCheckoutSelection={setCheckoutSelection}
      />
      <OrderSummary 
        items={items}
        subTotal={subTotal}
        shipping={shipping}
        total={total}
        loading={loading}
        sizes={sizes}
      />
    </form>
  )
}