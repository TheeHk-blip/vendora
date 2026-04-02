import mongoose, {Types, Document, Schema} from "mongoose";

export interface IPlan extends Document {
  name: string;
  slug: string;
  price: number;
  commission: number;
  fashionCommission: number;
  userLimit: number;
  features: [string];
  isActive: boolean;
}

const planSchema = new Schema<IPlan>(
  {
    name: {
      type: String,
      required: true,
      unique: true
    },
    slug: {
      type: String,
      required: true,
      unique: true
    },
    price: {
      type: Number,
      default: 0
    },
    commission: {
      type: Number,
      default: 0
    },
    fashionCommission: {
      type: Number,
      default: 0
    },
    userLimit: {
      type: Number,
      default: 0
    },
    features: {
      type: [String],
      default: []
    },
    isActive: {
      type: Boolean,
      default: true
    }
  }
)

const Plan = mongoose.models.Plan || mongoose.model<IPlan>("Plan", planSchema);

export default Plan;