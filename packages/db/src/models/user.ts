import mongoose, { Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  role: "buyer" | "seller" | "admin";
  password: string;
  image: string;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new mongoose.Schema({
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
  }
}, {timestamps: true});

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;