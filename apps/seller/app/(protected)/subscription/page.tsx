import { SerializeData, title } from "@vendora/ui";
import Pricing from "./components/pricing";
import { Seller, Subscription } from "@vendora/db/frontend";
import { getServerSession } from "next-auth";
import { authOptions } from "@vendora/auth";
import { Plan } from "./components/plan";
import { Metadata } from "next";

export const metadata:Metadata =  ({
  title: "Subscriptions | Vendora",
  description: "Manage your subscriptions and view plan benefits."
})

export interface UserPlan {
  status: string;
  isLifeTime: boolean;
  expiryDate: Date;
  plan: {
    _id: string,
    name: string
  }
}

export default async function Subscriptions() {
  const session = await getServerSession(authOptions);
  const seller = await Seller.findOne({ userId: session?.user._id });
  const sellerId = seller?._id;
  const plan = await Subscription.findOne({ subscriberId: sellerId , status: "active"})
    .populate([
      {
        path: "plan",
        model: "Plan",
        select: "name"
      }
    ])
    .lean()
  
  const serializedPlan = SerializeData(plan);

  return (
    <div className="flex flex-col justify-center" >
      <h1 className={title({ className: "text-center"})}>Manage Subscriptions</h1>
      <div className="flex flex-col gap-4 my-2.5"> 
        <Plan subscription={serializedPlan} />           
        <Pricing />
      </div>
    </div>
  )
}