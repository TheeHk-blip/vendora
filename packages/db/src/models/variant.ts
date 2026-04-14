import mongoose, { Document, Schema, Types } from "mongoose";
import type { TypedModel } from "./types";

export interface IVariantBase {
  productId?: Types.ObjectId;
  _id: string;
  sku?: string;
  price?: number;
  stock?: number;
  color?: string;
  image?: string [];
  attributes?: Schema.Types.Mixed;
}

export interface IVariant extends Document {
  productId: Types.ObjectId;
  sku: string;
  price: number;
  stock: number;
  color: string;
  image: [string];
  attributes: Schema.Types.Mixed;
  createdAt: Date;
  updatedAt: Date;
}

const variantSchema = new Schema<IVariant>({
  productId: {
    type: Schema.Types.ObjectId,
    ref: "Product",
    required: true,    
  },
  sku: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  stock: {
    type: Number,
    required: true
  },
  color: {
    type: String,
    default: ""
  },
  image: {
    type: [String], 
    default: []
  },
  attributes: {
    type: Map,
    of: Schema.Types.Mixed,
    default: {}
  }
}, { timestamps: true });

variantSchema.index({ productId: 1, attributes: 1 });

const Variant: TypedModel <IVariant> = 
  mongoose.models.Variant || mongoose.model<IVariant>("Variant", variantSchema);

export default Variant;