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

interface OrderProps {
  initialOrders: PopulatedOrder[];
  initialReviews: PopulatedReview[];
}

export default function OrdersClient({initialOrders, initialReviews}: OrderProps ) {
  const { data: session } = useSession();
  const { showToast } = useToast();
  const [orders, setOrders] = useState(initialOrders);
  const [reviews, setReviews] = useState(initialReviews);
  const [ratings, setRatings] = useState<Record<string, number | null>>({});
  const [comments, setComments] = useState<Record<string, string>>({});

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
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER}payments/stk-push`, {
        method: "POST",
        headers: { "Content-Type": "application/json"},
        body: JSON.stringify({
          orderId
        })
      });

      const data = await response.json();
      if (data.success) {
        showToast("STK Push sent! Check your phone", "success");
      }
    } catch (error) {
      console.error("Payment trigger failed", error);
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
    <div className="flex flex-col justify-center">
      <h1 className={title({ className: "text-center"})}>Your Orders</h1>
      <div className="columns-1 md:columns-2 gap-4 my-2.5">
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
            {Number(order.financials.balanceDue) > 0 && (
              <div className="mt-2 flex justify-between items-center p-3 bg-green-500/5 rounded-lg border border-green-500/20">
                <span className="text-sm font-medium text-green-700">Balance: <PriceDisplay amount={Number(order.financials.balanceDue)} /></span>
                <Button color="success" size="sm" onClick={() => handlePayment(order._id)}>Pay Now</Button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}