import { Metadata } from "next";
import { Users } from "./components/users";
import { PlatformRevenue, TotalRevenue } from "./components/revenue";
import { RecentOrders } from "./components/recentOrders";

export const metadata: Metadata = {
  title: "Dashboard | Vendora",
  description: "Tools designed to help your business scale and be profitable."
}

export default async function DashboardPage() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 my-2.5"> 
      <TotalRevenue />  
      <PlatformRevenue />
      <Users />     
      <div className="md:col-span-3">
        <RecentOrders />
      </div>
    </div>
  )
}