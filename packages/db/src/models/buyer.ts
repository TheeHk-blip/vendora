import mongoose, { Document, Schema, Types} from "mongoose";

export interface IBuyer extends Document {
  userId: Types.ObjectId;
  shippingAddress?:{
    street: string,
    city: string,
    state: string,
    country: string,
    zipcode: string,
  }[];
  wishlist?: Types.ObjectId;
  preferences?: {
    notifications: Boolean,
    newsletter: Boolean
  };
  phoneNumber: string;
  createdAt: Date;
  updatedAt: Date;
}

const addressSchema = new Schema({
  street: String,
  city: String,
  state: String,
  country: String,
  zipcode: String
}, {_id: false})

const buyerSchema = new Schema<IBuyer>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true
  },
  shippingAddress: {
    type: [addressSchema],
    default: []
  },
  wishlist: {
    type: Schema.Types.ObjectId,
    ref: "Product"
  },
  preferences: {
    type: new Schema({
      notificaions: { type: Boolean, default: true },
      newsletter: { type: Boolean, default: false }
    }, { _id: false }),
    default: {},
  },
  phoneNumber: {
    type: String,
    trim: true
  }
}, {timestamps: true});

const Buyer = mongoose.models.Buyer || mongoose.model<IBuyer>("Buyer", buyerSchema);

export default Buyer;