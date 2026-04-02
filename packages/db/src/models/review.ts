import mongoose, { Document, Schema, Types } from "mongoose";

export interface IReview extends Document {
  reviewerId: Types.ObjectId;
  sellerId: Types.ObjectId;
  productId: Types.ObjectId;
  rating: number;
  comment: string;
  createdAt: Date;
  updatedAt: Date;
}

const reviewSchema = new Schema<IReview>({
  reviewerId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  sellerId: {
    type: Schema.Types.ObjectId,
    ref: "Seller",
    required: true
  },
  productId: {
    type: Schema.Types.ObjectId,
    ref: "Product",
    required: true
  },
  rating: {
    type: Number,
    default: 0
  },
  comment: {
    type: String,
    default: ""
  }
}, { timestamps: true });

reviewSchema.index({ reviewerId: 1, productId: 1}, { unique: true });

const Review = mongoose.models.Review || mongoose.model<IReview>("Review", reviewSchema);

export default Review;