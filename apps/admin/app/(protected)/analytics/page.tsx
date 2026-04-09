import { title } from "@vendora/ui";
import { Metadata } from "next";
import { RevenueChart } from "../components/revenueChart";
import { PlatformStats } from "../data";

export const metadata: Metadata = {
  title: "Analytics | Vendora",
  description: "Get a clear picture of how your business is performing with precise analytics features."
}

export default async function Analytics() {
  const { chartData } = await PlatformStats();
  return(
    <div className="flex flex-col gap-5">
      <h1 className={title({color: "foreground"})}>Analytics</h1>
      <RevenueChart data={chartData} />
    </div>
  )
}