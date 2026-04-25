import mongoose, { Document, Schema, Types} from "mongoose";
import { TypedModel } from "./types";

export interface ISupportTicket extends Document {
  title: string;
  description: string;
  userId: Types.ObjectId;
  userRole: "buyer" | "seller";
}

const supportTickectSchema = new Schema<ISupportTicket> ({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  userRole: {
    type: String,
    enum: ["buyer", "seller"]
  }
})

supportTickectSchema.index({ userId: 1, userRole: 1});

const SupportTicket: TypedModel<ISupportTicket> = 
  mongoose.models.SupportTicket || mongoose.model<ISupportTicket>("SupportTicket", supportTickectSchema);

export default SupportTicket;