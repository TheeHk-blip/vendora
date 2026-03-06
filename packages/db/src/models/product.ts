import mongoose, { Document, Schema, Types } from "mongoose";

export interface IProductBase {  
  _id: string;
  name?: string;
  price: number;
  description?: string;
  fields?: Record<string, string | number>;
  discount?: number;
  discountedPrice?:number; 
  images: [string];
  featured?: boolean;
}

export interface IProduct extends Document {
  sellerId: Types.ObjectId;
  categoryId: Types.ObjectId;
  name: string;
  price: number;
  description: string;
  discount?: number;
  discountedPrice?:number;
  fields?: Schema.Types.Mixed;
  images: [string];
  featured?: boolean;
  status?: "live" | "pending" | "rejected";
  createdAt: Date;
  updatedAt: Date;
}

const productSchema = new Schema<IProduct>({
  sellerId: {
    type: Schema.Types.ObjectId,
    ref: "Seller",
    required: true,    
  },
  categoryId: {
    type: Schema.Types.ObjectId,
    ref: "Category",
    required: true,    
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
  discountedPrice: {
    type: Number
  },
  fields: {
    type: Schema.Types.Mixed,
    default: {}
  },
  images: {
    type: [String],
    default: []
  },
  featured: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ["live", "pending", "rejected"]
  }
}, { timestamps: true });

productSchema.index({categoryId: 1, price: 1})

const Product = mongoose.models.Product || mongoose.model<IProduct>("Product", productSchema);

export default Product;