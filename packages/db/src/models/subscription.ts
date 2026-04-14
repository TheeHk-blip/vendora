import mongoose, {Types, Document, Schema} from "mongoose";
import { TypedModel } from "./types";

export interface ISubscription extends Document {
  subscriberId: Types.ObjectId;
  plan: Types.ObjectId;
  status: "pending" | "active" | "renewed" | "upgraded" | "expired" | "cancelled" | "failed";
  checkoutRequestId: string;
  receiptNumber: string;
  metadata: {
    upgradeId: Types.ObjectId,
    action: "upgrade" | "renewal",
    bonusDays: number
  }
  isLifeTime: boolean,
  startDate: Date;
  expiryDate: Date;
}

const subscriptionSchema = new Schema<ISubscription>(
  {
    subscriberId: {
      type: Schema.Types.ObjectId,
      ref: "Seller",
      required: true,
    },
    plan: {
      type: Schema.Types.ObjectId,
      ref: "Plan",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "active", "renewed", "upgraded", "expired", "cancelled", "failed"],
      default: "active"
    },
    checkoutRequestId: {
      type: String
    },
    receiptNumber: {
      type: String
    },
    metadata: {
      upgradeId: {
        type: Schema.Types.ObjectId,
        ref: "Plan"
      },
      action: {
        type: String,
        enum: ["upgrade", "renewal"]
      },
      bonusDays: {
        type: Number
      }
    },
    isLifeTime: {
      type: Boolean,
      default: true
    },
    startDate: {
      type: Date,
      default: Date.now
    },
    expiryDate: {
      type: Date,      
    }
  }
)

const Subscription: TypedModel <ISubscription> = 
  mongoose.models.Subscription || mongoose.model<ISubscription>("Subscription", subscriptionSchema);

export default Subscription;