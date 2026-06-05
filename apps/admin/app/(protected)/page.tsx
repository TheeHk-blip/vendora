import { Metadata } from "next";
import { Users } from "./components/users";
import { PlatformRevenue, TotalRevenue } from "./components/revenue";
import { RecentOrders } from "./components/recentOrders";
import { TimeRange } from "./data";
import { TimeFilter } from "./components/timeFilter";

export const metadata: Metadata = {
  title: "Dashboard | Vendora",
  description: "Tools designed to help your business scale and be profitable."
}

interface PageProps {
  searchParams: Promise<{ range?: string }>;
}

export default async function DashboardPage({ searchParams }: PageProps) {  
  const resolvedParams = await searchParams;
  const rawRange = resolvedParams.range;
  const range: TimeRange = (rawRange === "1wk" || rawRange === "30d" || rawRange === "90d" || rawRange === "all")
    ? rawRange
    : "1wk";

  return (
    <div>
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold uppercase tracking-wide">Dashboard Summary</h1>        
        <TimeFilter />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5 my-2.5"> 
        <TotalRevenue range={range} />  
        <PlatformRevenue range={range} />
        <Users range={range} />     
        <div className="md:col-span-full">
          <RecentOrders range={range} />
        </div>
      </div>
    </div>
  )
}