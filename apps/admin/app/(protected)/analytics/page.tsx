import { title } from "@vendora/ui";
import { Metadata } from "next";
import { RevenueChart } from "../components/revenueChart";
import { PlatformStats, TimeRange } from "../data";
import { TimeFilter } from "../components/timeFilter";

export const metadata: Metadata = {
  title: "Analytics | Vendora",
  description: "Get a clear picture of how your business is performing with precise analytics features."
}

interface PageProps {
  searchParams: Promise<{ range?: string }>;
}

export default async function Analytics({ searchParams }: PageProps) {
  const resolvedParams = await searchParams;
  const rawRange = resolvedParams.range;
  const range: TimeRange = (rawRange === "1wk" || rawRange === "30d" || rawRange === "90d" || rawRange === "all")
    ? rawRange
    : "1wk";
  const { chartData } = await PlatformStats(range);
  return(
    <div className="flex flex-col gap-5">
      <div className="flex flex-row justify-between items-center">
        <h1 className={title({color: "foreground"})}>Analytics</h1>
        <TimeFilter />
      </div>     
      <RevenueChart data={chartData} />
    </div>
  )
}