import mongoose, { Document, Schema, Types } from "mongoose";
import { TypedModel } from "./types";

export interface IUser extends Document {
  name: string;
  email: string;
  role: "buyer" | "seller" | "admin";
  password: string;
  image: string;
  isVerified: boolean;
  verificationOtp: {
    code: string;
    expiresAt: Date;
  }
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>({
  name: {
    type: String,
    required: true,
    trim: true, // avoid accidental whitespaces
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  role: {
    type: String,
    enum: ["buyer", "seller", "admin"],    
  },
  password: {
    type: String,
  },
  image: {
    type: String
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  verificationOtp: {
    code: {
      type: String
    },
    expiresAt: {
      type: Date
    }
  }
}, {timestamps: true});

userSchema.index({ name: 1 })

const User: TypedModel <IUser> = 
  mongoose.models?.User || mongoose.model("User", userSchema);

export default User;