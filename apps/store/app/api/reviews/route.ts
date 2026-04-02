import { connectDB, Product, Review, Seller } from "@vendora/db";
import mongoose from "mongoose";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export async function POST(req: Request) {

  try {
    const { productId, sellerId, rating, comment, reviewerId } = await req.json();      
    await connectDB();          

    const reviewerID = new mongoose.Types.ObjectId(reviewerId as string);
    const sellerID = new mongoose.Types.ObjectId(sellerId as string);
    const productID = new mongoose.Types.ObjectId(productId as string);

    const existingReview = await Review.findOne({
      reviewerId: reviewerID,
      productId: productID
    });

    if (existingReview) {
      return  NextResponse.json(
        { error: "You have already reviewed this product" },
        { status: 400 }
      )
    }
   
    await Review.create({
      reviewerId: reviewerID,
      sellerId: sellerID,
      productId: productID,
      rating: Number(rating),
      comment: comment
    })

    const productStats = await Review.aggregate([
      { $match: { productId: productID }},
      { $group: {
        _id: "$productId",
        avg: { $avg: "$rating" },
        count: { $sum: 1 }
      }}
    ]);

    if (productStats.length > 0) {
      await Product.findByIdAndUpdate(productId, {
        averageRating: Math.round(productStats[0].avg * 10) / 10,
        totalReviews: productStats[0].count
      });
    }

    const sellerStats = await Review.aggregate([
      { $match: { sellerId: sellerID }},
      { $group: {
        _id: "$sellerId",
        avg: { $avg: "$rating" },
        count: { $sum: 1 }
      }}
    ]);

    if (sellerStats.length > 0) {
      await Seller.findByIdAndUpdate(sellerId, {
        averageRating: Math.round(sellerStats[0].avg *10) / 10,
        totalReviews: sellerStats[0].count,
      });
    }

    revalidatePath("/orders");

    return NextResponse.json({ success: true }, { status: 201});

  } catch (error) {
    console.error("Review submission failed:", error);
    return NextResponse.json({ "Review submission failed. Try again later": error }, {status: 400})
  }
}