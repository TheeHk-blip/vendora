import { authOptions } from "@vendora/auth";
import { connectDB, Order, Review } from "@vendora/db"
import { getServerSession } from "next-auth";
import OrdersClient from "./components/orderClient";
import { SerializeData } from "@vendora/ui";
import { Suspense } from "react";
import { connection } from "next/server";

export interface PopulatedVariant {
  _id: string;
  image: string[];
  productId: {
    _id: string;
    name: string;
  };
}

export interface PopulatedOrderItem {
  _id: string;
  variantId: PopulatedVariant;
  quantity: number;
  price: string;
  seller: {
    sellerId: {_id: string}
    storeName: string;
  }
}

export interface PopulatedOrder {
  _id: string;
  orderNumber: string;
  items: PopulatedOrderItem[];
  status: string;
  financials: {
    balanceDue: number;
  }
}

export interface PopulatedReview {
  reviewerId: string;
  productId: string;
  rating: number;
  comment: string;
}

async function OrdersData() {
  await connection();
  await connectDB();
  const session = await getServerSession(authOptions);
  const userId = session?.user._id;
  const orders = await Order.find({ "buyer.buyerId": userId })
    .populate([
      {
        path: "items.variantId",
        model: "Variant",
        select: "image _id productId",
        populate: {
          path: "productId",
          model: "Product",
          select: "name"
        } 
      },
      {
        path: "items.seller.sellerId",
        model: "Seller",
        select: "sellerId"
      }       
    ])
    .sort({ createdAt: -1 })
    .lean<PopulatedOrder[]>();  

  const productIds = orders.flatMap(order =>
    order.items.map((item) => item.variantId.productId._id)
  ).filter(Boolean);

  const userReviews = await Review.find({
    reviewerId: userId,
    productId: { $in: productIds }
  }).lean();

  return (
    <OrdersClient initialOrders={SerializeData(orders)} initialReviews={SerializeData(userReviews)} />
  )
}

export default async function Orders() {
  return (   
    <Suspense>
      <OrdersData />   
    </Suspense>     
  )
}