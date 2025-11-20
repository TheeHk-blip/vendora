import mongoose, { Document, Schema, Types} from "mongoose";

export interface ISeller extends Document {
  userId: Types.ObjectId;
  businessName?: string;
  taxId?: string;
  businessPhone?: string;
  businessEmail?: string;
  paymentDetails?: {
    accountHolder: string;
    bankName: string;
    accountNumber: string;
    routingNumber: string;
  };
  rating: number;
  createdAt: Date;
  updatedAt: Date;
}

const paymentSchema = new Schema(
  {
    accountHolder: { type: String, trim: true },
    bankName: { type: String, trim: true },
    accountNumber: { type: String, trim: true },
    routingNumber: { type: String, trim: true },
  },
  { _id: false }
);

const sellerSchema = new Schema<ISeller>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    businessName: { 
      type: String, 
      trim: true 
    },
    taxId: { 
      type: String, 
      trim: true 
    },
    businessPhone: { 
      type: String, 
      trim: true 
    },
    businessEmail: { 
      type: String, 
      trim: true, 
      lowercase: true 
    },
    paymentDetails: { 
      type: [paymentSchema], 
      default: {} 
    },
    rating: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

const Seller = mongoose.models.Seller || mongoose.model<ISeller>("Seller", sellerSchema);

export default Seller;