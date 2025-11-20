import mongoose, { Document, Schema, Types } from "mongoose";

export interface IProduct extends Document {
  sellerId: Types.ObjectId;
  name: string;
  price: number;
  description: string;
  discount?: number;
  previousPrice?:number;
  image: [string];
  featured?: boolean;
  approved?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const productSchema = new Schema<IProduct>({
  sellerId: {
    type: Schema.Types.ObjectId,
    ref: "Seller",
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  price: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  discount: {
    type: Number
  },
  previousPrice: {
    type: Number
  },
  image: {
    type: [String],
    default: []
  },
  featured: {
    type: Boolean,
    default: false
  },
  approved: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

const Product = mongoose.models.Product || mongoose.model<IProduct>("Product", productSchema);

export default Product;