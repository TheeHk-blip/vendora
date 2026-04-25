import mongoose, { Document, Schema, Types} from "mongoose";
import type { TypedModel } from "./types.js";

export interface IOrder extends Document {
  orderNumber: string;
  lifeCycleStarted: boolean;
  paymentType: "upfront" | "partial";
  paymentMethod: "card" | "mpesa";
  buyer: {
    buyerId: Types.ObjectId;
    email: string;
    phone: string;
    name: string;
    location: {
      county: string,
      subCounty: string;
      ward: string;     
    } 
  },  
  items: Array<{
    variantId: Types.ObjectId;
    seller: {
      sellerId: Types.ObjectId;
      storeName: string;  
      sellerPayout: number;    
    },
    name: string;
    sku: string;
    price: number;
    quantity: number;
    itemRevenue: number;
    appliedCommission: number;
    isSealProtected: boolean;
    hsCode: string;
    deliveryToHub: {
      status: "pending" | "shippedToHub" | "receivedAtHub",
      updatedAt: Date
    }
  }>;
  logistics: {
    batchId?: Types.ObjectId;
    riderId?: Types.ObjectId;
    dispatchType: "hubExpress" | "sellerPickUp" | "standard";
    estimatedDelivery?: Date;
  },
  financials: {
    totalProductValue: number;
    commitmentFee: number;
    balanceDue: number;
    commisionRate: number;
    platformRevenue: number;    
    sellerPayout: number;
  },
  payments: {
    commitment: {
      status:"pending" | "paid" | "refunded" | "failed";
      checkoutRequestId?: string;
      receiptNumber?: string;
      paidAt?: Date;
    },
    balance: {
      status: "pending" | "paid";
      checkoutRequestId?: string;
      receiptNumber?: string;
      paidAt: Date;
    }
  },
  status: "awaitingCommitment" | "awaitingDispatch" | "inTransit" | "delivered" | "rejected";
  rejectionMetaData?: {
    reason: string;
    evidenceImage: [string]
  }
  createdAt: Date;
  updatedAt: Date
}

const orderSchema = new Schema<IOrder>({
  orderNumber: {
    type: String,
    required: true,
    unique: true
  },
  paymentType: {
    type: String,
    enum: ["upfront", "partial"],
    required: true
  },
  paymentMethod: {
    type: String,
    enum: ["card", "mpesa"],
    required: true
  },
  lifeCycleStarted: {
    type: Boolean,
    default: false
  },
  buyer: {
    buyerId: {
      type: Schema.Types.ObjectId,
      ref: "Buyer",
      required: true
    },
    email: {
      type: String
    },
    phone: {
      type: String
    },
    name: {
      type: String
    },
    location: {
      county: {
        type: String,       
      },
      constituency: {
        type: String,      
      },
      ward: {
        type: String,     
      }
    }
  },  
  items: [
    {
      variantId: {
        type: Schema.Types.ObjectId,
        ref: "Variant"
      },
      seller: {
        sellerId: {
          type: Schema.Types.ObjectId,
          ref: "Seller",
          required: true
        },
        storeName: {
          type: String
        },
        sellerPayout: {
          type: Number,
          required: true
        }
      },
      name: {
        type: String
      },
      sku: {
        type: String
      },
      price: {
        type: String
      },
      quantity: {
        type: Number
      },
      itemRevenue: {
        type: Number,
        required: true
      },
      appliedCommission: {
        type: Number,
        required: true
      },
      isSealProtected: {
        type: Boolean
      },
      hsCode: {
        type: String
      },
      deliveryToHub: {
        status: {
          type: String,
          enum: ["pending", "shippedToHub", "receivedAtHub"],
          default: "pending" 
        },
        updatedAt: Date
      },      
    }
  ],
  logistics: {
    batchId: {
      type: Schema.Types.ObjectId,
      ref: "Batch"
    },
    riderId: {
      type: Schema.Types.ObjectId,
      ref: "Rider"
    },
    dispatchType: {
      type: String,
      enum: ["hubExpress", "sellerPickup", "standard"],
      default: "standard"
    },
    estimatedDelivery: {
      type: Date
    }
  },
  financials: {
    totalProductValue: {
      type: Number,
      required: true
    },
    commitmentFee: {
      type: Number,
    },
    balanceDue: {
      type: Number,
    },
    commissionRate: {
      type: Number,
      required: true
    },
    platformRevenue: {
      type: Number,
      required: true
    },
    sellerPayout: {
      type: Number,
      required: true
    }
  },
  payments: {
    commitment: {
      status: {
        type: String,
        enum: ["pending", "paid", "refunded", "failed"],      
      },
      checkoutRequestId: {
        type: String
      },
      receiptNumber: {
        type: String
      },
      paidAt: {
        type: Date
      }
    },
    balance: {
      status: {
        type: String,
        enum: ["pending", "paid"],
        default: "pending"
      },
      checkoutRequestId: {
        type: String
      },
      receiptNumber: {
        type: String
      },
      balanceDue: {
        type: Number
      },
      paidAt: Date,
    }
  },
  status: {
    type: String,
    enum: ["awaitingCommitment", "awaitingDispatch", "inTransit", "delivered", "rejected"],
    default: "awaitingCommitment",
  },
  rejectionMetaData: {
    reason: {
      type: String,
      evidenceImage: [String],
    }
  },  
}, {timestamps: true});

orderSchema.index({createdAt: -1, "items.seller.sellerId": 1});

const Order: TypedModel<IOrder> = 
  mongoose.models.Order || mongoose.model<IOrder>("Order", orderSchema);

export default Order;