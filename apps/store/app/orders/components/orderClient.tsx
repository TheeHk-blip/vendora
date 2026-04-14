"use client";

import { Button, STATUS_COLORS, TextField, title, useToast } from "@vendora/ui";
import { PopulatedOrder, PopulatedOrderItem, PopulatedReview } from "../page";
import Image from "next/image";
import PriceDisplay from "@vendora/ui/src/components/priceDisplay";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { socket } from "@/app/utilities/socket";
import { Rating } from "@mui/material";
import StarRate from "@mui/icons-material/StarRate";
import { useRouter } from "next/navigation";

interface OrderProps {
  initialOrders: PopulatedOrder[];
  initialReviews: PopulatedReview[];
}

export default function OrdersClient({initialOrders, initialReviews}: OrderProps ) {
  const { data: session } = useSession();
  const router = useRouter();
  const { showToast } = useToast();
  const [orders, setOrders] = useState(initialOrders);
  const [reviews, setReviews] = useState(initialReviews);
  const [ratings, setRatings] = useState<Record<string, number | null>>({});
  const [comments, setComments] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const userId = session?.user._id;
  
  useEffect(() => {    
    if (userId) {
      socket.emit("join-order-room", userId);
    }

    socket.on("order-status-update", ({ orderId, status }) => {
      setOrders((prevOrders) => 
        prevOrders.map((order) => order._id.toString() === orderId ? {...order, status } : order)
      );
    });

    return () => {
      socket.off("order-status-update");
    }
  }, [userId]);
  
  const handlePayment =  async (orderId: string) => {
    setLoading(true);
    const response = await fetch(`/api/order?orderId=${orderId}`);
    const data = await response.json();
    console.log("Payment:", data.existingOrder?.paymentMethod)
    const endpoint = data.existingOrder?.paymentMethod === "card"
      ? `${process.env.NEXT_PUBLIC_SERVER}payments/stripe`
      : `${process.env.NEXT_PUBLIC_SERVER}payments/stk-push`

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json"},
        body: JSON.stringify({
          orderId,
          type: "order"
        })
      });

      const result = await response.json();
      if (result.url) {        
        window.location.href = result.url;
      } else {
        showToast(`Error making payment`, "error");
      }  

      if (response.ok && !result.url) {
        const { orderId, orderNumber, amount } = result;
        showToast("STK Push Sent! Enter your PIN to authorize the transaction", "success");
        
        socket.emit("join-order-room", orderId);
        router.push(`/store/order-status/payments?id=${orderId}&no=${orderNumber}&amt=${amount}`);      
      } else {
        showToast(`Error: ${result.error || "Failed to initialize payment. Try again"}`, "error")
      }  
    } catch (error) {
      console.error("Payment trigger failed", error);
    } finally {
      setLoading(false)
    }
  };

  const handleReviewSubmit = async (item: PopulatedOrderItem, orderId: string) => {
    const itemId = item.variantId._id.toString();
    const rating = ratings[itemId];
    const comment = comments[itemId];
    const reviewerId = userId;
    const productId = item.variantId.productId._id;
    const sellerId = item.seller.sellerId._id;

    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json"},
        body: JSON.stringify({
          orderId,
          productId: productId,
          sellerId: sellerId,
          rating,
          comment,
          reviewerId
        }),       
      });

      if (response.ok) {
        showToast("Review Submitted", "success");
        setComments(prev => {
          const newState = {...prev};
          delete newState[itemId];
          return newState;
        });        
        setRatings(prev => {
          const newState = {...prev};
          delete newState[itemId];
          return newState;
        });      
        const newReview = {
          productId: productId,
          reviewerId: userId ?? "",
          rating: rating ?? 0,
          comment
        };
        setReviews((prev) => [...prev, newReview]);
      }
    } catch (error) {
      showToast("Failed to submit review", "error");
      console.log("Error:", error)
    }
  }

  return (
    <div className="relative flex flex-col justify-center">
      <h1 className={title({ className: "text-center"})}>Your Orders</h1>
      <div className={loading ? "columns-1 md:columns-2 gap-4 my-2.5 opacity-30 pointer-events-none": "columns-1 md:columns-2 gap-4 my-2.5 opacity-100"}>
        {orders.map((order) => (
          <div 
            key={order._id.toString()} 
            className="break-inside-avoid gap-3 my-2 p-4 ring ring-foreground/35 rounded-2xl bg-background/50 shadow-xs"
          >          
            <div className="flex justify-between items-center pb-2 border-b border-foreground/25">
              <span className="text-gray-600 dark:text-gray-300">Order: {order.orderNumber}</span>
              <span className={`text-xs rounded-full px-3 py-1 font-semibold ${order.status ? STATUS_COLORS[order.status] : ""}`}>
                {order.status}
              </span>
            </div>

            <div className="grid grid-cols-1 gap-4 mt-2">
              {order.items.map((item) => {
                const itemId = item.variantId._id.toString();                
                const isReviewed = reviews.find(
                  (r) => r.productId.toString() === item.variantId.productId._id.toString() 
                )                
                return(
                  <div 
                    key={itemId}
                    className="bg-foreground/15 p-3 rounded-xl flex flex-col gap-3"
                  >
                    <div className="flex gap-5">
                      <Image 
                        alt={item.variantId.productId.name}
                        src={item.variantId.image[0]}
                        width={80}
                        height={80}
                        className="rounded-lg object-cover h-20 w-20"
                      />
                      <div className="flex flex-col text-sm truncate">
                        <span className="font-medium truncate">{item.variantId.productId.name}</span>
                        <span className="text-gray-500">Qty: {item.quantity}</span>
                        <PriceDisplay amount={Number(item.price)} />
                      </div>
                    </div>
               
                    {order.status === "delivered" && (
                      <div className="mt-2 border-t border-foreground/35 flex flex-col gap-2">
                        {isReviewed ? (      
                          <div>                                                                          
                            <div key={isReviewed.reviewerId} className="flex flex-col">
                              {isReviewed.reviewerId === userId && 
                                <div>
                                  <span className="flex flex-row items-center gap-1">Rating: {isReviewed.rating} <StarRate className="text-yellow-600 mb-1" sx={{ width: 20, height: 20 }} /></span>
                                  <span>Review: {isReviewed.comment}</span>
                                </div>
                              }
                            </div>                                                        
                          </div>
                        ):(
                          <>
                          <Rating 
                            size="small" 
                            name={`rating-${itemId}`}
                            value={ratings[itemId] || 0} 
                            onChange={(event, newValue) => {
                              setRatings(prev => ({
                                ...prev,
                                [itemId]: newValue
                              }))
                            }}                             
                            sx={{ "& .MuiRating-iconEmpty": { color: "gray"}}} 
                          />
                          {Boolean(ratings[itemId] && ratings[itemId] > 0)  &&
                            <TextField 
                              name={`review-${itemId}`}
                              label="What did you like about this product?"
                              rows={3}
                              limit={1000}
                              minChar={0}
                              value={comments[itemId] || ""}
                              onChange={(e) => {
                                setComments(prev => ({ ...prev, [itemId]: e.target.value }));
                              }}
                            />
                          }                                                  
                          <Button 
                            size="sm" 
                            color="primary"                          
                            disabled={!ratings[itemId]}
                            onClick={() => handleReviewSubmit(item, order._id)}
                            className="w-full text-xs"
                          >
                            Submit Review
                          </Button>
                          </>        
                        )}              
                      </div>
                    )}
                  </div>
                )
              })}
            </div>

            {/* Order Footer / Balance Payment */}
            {order.status === "delivered" &&
              <>
              {Number(order.financials.balanceDue) > 0 && (
                <div className="mt-2 flex justify-between items-center p-3 bg-green-500/5 rounded-lg border border-green-500/20">
                  <span className="text-sm font-medium text-green-700">Balance: <PriceDisplay amount={Number(order.financials.balanceDue)} /></span>
                  <Button color="success" size="sm" onClick={() => handlePayment(order._id)}>Pay Now</Button>
                </div>
              )}
              </>
            }
          </div>
        ))}
      </div>

      {loading && (
        <div className="fixed inset-0 flex items-center justify-center z-10">
          <span className="bg-black/70 dark:bg-white/70 px-4 py-2 rounded-full font-medium shadow-sm">
            Initializing payment...
          </span>
        </div>
      )}
    </div>
  )
}