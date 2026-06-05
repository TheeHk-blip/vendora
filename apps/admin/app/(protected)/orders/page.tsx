import { title } from "@vendora/ui";
import { Metadata } from "next";
import OrderClient from "./components/orderTable";
import { PlatformStats } from "../data";

export const metadata: Metadata = {
  title: "Orders | Vendora",
  description: "Access all  your orders - active, pending and cancelled ones."
}

export default async function Orders() {
  const { orders } = await PlatformStats();
  return (
    <div className="flex flex-col justify-center gap-3.5">      
      <h1 className={title({ color: "foreground" })}>Orders</h1>          
      <OrderClient order={orders} />
    </div>
  )
}