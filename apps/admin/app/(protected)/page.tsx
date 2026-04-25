import { Metadata } from "next";
import { Users } from "./components/users";
import { PlatformRevenue, TotalRevenue } from "./components/revenue";
import { RecentOrders } from "./components/recentOrders";

export const metadata: Metadata = {
  title: "Dashboard | Vendora",
  description: "Tools designed to help your business scale and be profitable."
}

export default function DashboardPage() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5 my-2.5"> 
      <TotalRevenue />  
      <PlatformRevenue />
      <Users />     
      <div className="md:col-span-full">
        <RecentOrders />
      </div>
    </div>
  )
}