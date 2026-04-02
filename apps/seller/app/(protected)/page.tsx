import { Metadata } from "next";
import { RevenueCard } from "./components/revenue";
import { getSellerStats } from "./utilities/data-fetcher";
import { Customers } from "./components/customers";
import { Performance } from "./components/rating";
import { RecentOrders } from "./components/recentOrders";

export const metadata:Metadata =  ({
  title: "Dashboard | Vendora",
  description: "Manage your store conviniently with industry leading tools"
})

export default async function Dashboard() {
 const { totalRevenue, revenueTrend } = await getSellerStats();
  return(
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 my-2.5" >
      <RevenueCard totalRevenue={totalRevenue} revenueTrend={revenueTrend} />
      <Customers/>   
      <Performance />  
      <div className="md:col-span-3">
        <RecentOrders /> 
      </div>       
    </div>
  )
}
