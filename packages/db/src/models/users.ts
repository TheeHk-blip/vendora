import mongoose, { Document } from "mongoose";

interface User extends Document {
  email: string;
  name: string;
  password: string;
  hasPassword: boolean;
  role: "buyer" | "seller" | "admin";
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: false
  },
  role: {
    type: String,
    enum: ["buyer", "seller", "admin"],
    required: false
  }
});

const User = mongoose.models.Users || mongoose.model("Users", userSchema);

export default User;