import mongoose from "mongoose";
import { Plan } from "@vendora/db";

const plans = [
  {
    slug: "basic",
    name: "Basic",
    price: 0,
    commission: 0.12,
    fashionCommission: 0.16,
    userLimit: 0,
    features: ["Basic Analytics", "Standard support"]
  },
  {
    slug: "startup",
    name: "Startup",
    price: 3500,
    commission: 0.07,
    fashionCommission: 0.11,
    userLimit: 2,
    features: ["Advanced Analytics", "Marketing tools", "Trusted badge eligibility", "Priority support"]
  },
  {
    slug: "pro",
    name: "Pro",
    price: 7500,
    commission: 0.05,
    fashionCommission: 0.09,
    userLimit: 5,
    features: ["Advanced Analytics", "Marketing Tools", "Trusted badge eligibility", "Dedicated support"]
  }
]

async function SeedPlans() {
  try {
    const MONGO_URI = process.env.MONGODB_URI as string;
    if (!MONGO_URI) throw new Error ("MONGO URI not defined");

    await mongoose.connect(MONGO_URI);

    for (const planData of plans) {
      await Plan.findOneAndUpdate({ slug: planData.slug }, planData, {
        upsert: true,
        new: true
      });
    }

    console.log("Plans seeded successfully")
  } catch (error) {
    console.error("Failed to seed plans:", error)
  } finally {
    await mongoose.disconnect();
  }
}

SeedPlans().catch(console.error);