import { Card } from "@vendora/ui";
import { PlatformStats, TimeRange } from "../data";
import Link from "next/link";
import { LinkOutlined, MonetizationOn } from "@mui/icons-material";
import TrendingUp from "@mui/icons-material/TrendingUp";
import TrendingDown from "@mui/icons-material/TrendingDown";
import PriceDisplay from "@vendora/ui/src/components/priceDisplay";

export const getPeriodLabel = (range: TimeRange) => {
  if (range === "1wk") {
    return "prev week"
  } else if (range === "90d") {
    return "prev 3 months"
  } else {
    return "last month";
  }
};

export interface ComponentProps {
  range: TimeRange
}

export async function PlatformRevenue({ range }: ComponentProps) {
  const { platformRevenue, prevPlatformRevenue, totalRevenueTrend } = await PlatformStats(range);
  const periodLabel = getPeriodLabel(range);
  return (
    <Card
      header={
        <span className="flex flex-row text-gray-600 dark:text-gray-400 items-center justify-between" >
          Platform Revenue
          <Link
            href="/analytics"
            className="flex flex-row rounded-2xl px-2 py-1 gap-2 active:scale-[0.98] transition-all duration-500 bg-black/15 dark:bg-white/15 hover:bg-black/25 hover:dark:bg-white/25"
          >
            <MonetizationOn />
            <LinkOutlined className="text-blue-600" />
          </Link>          
        </span>
      }
      footer={
        range === "all" ? (
          <div className="text-gray-500 text-sm mt-1">Showing lifetime platform revenue</div>
        ):(
        totalRevenueTrend && totalRevenueTrend > 0 ? (
          <div className="flex flex-row gap-2" >          
            <span className="text-green-500">
              <TrendingUp  /> {" "}
              +{totalRevenueTrend}%  
            </span>
            {periodLabel} <PriceDisplay amount={prevPlatformRevenue} />
          </div>
        ):(
          <div className="flex flex-row gap-2" >          
            <span className="text-red-500">
              <TrendingDown  /> {" "}
              {totalRevenueTrend}%  
            </span>
            {periodLabel} <PriceDisplay amount={prevPlatformRevenue} />
          </div>
        ))
      }
    >
      <span className="text-3xl font-bold"><PriceDisplay amount={platformRevenue} /></span>      
    </Card>
  )
}

export async function TotalRevenue({ range }: ComponentProps) {
  const {totalRevenue, prevTotalRevenue, totalRevenueTrend} = await PlatformStats(range);
  const periodLabel = getPeriodLabel(range);
  return(
    <Card
      header={
        <span className="flex flex-row text-gray-600 dark:text-gray-400 items-center justify-between" >
          Total Revenue
          <Link
            href="/analytics"
            className="flex flex-row rounded-2xl px-2 py-1 gap-2 active:scale-[0.98] transition-all duration-500 bg-black/15 dark:bg-white/15 hover:bg-black/25 hover:dark:bg-white/25"
          >
            <MonetizationOn />
            <LinkOutlined className="text-blue-600" />
          </Link> 
        </span>
      }
      footer={
        range === "all" ? (
          <div className="text-gray-500 text-sm mt-2 font-medium">Lifetime sales volume</div>
        ):(
        totalRevenueTrend && totalRevenueTrend > 0 ? (
          <div className="flex flex-row gap-2" >          
            <span className="text-green-500">
              <TrendingUp  /> {" "}
              +{totalRevenueTrend}%  
            </span>
            {periodLabel} <PriceDisplay amount={prevTotalRevenue} />
          </div>
        ):(
          <div className="flex flex-row gap-2" >          
            <span className="text-red-500">
              <TrendingDown  /> {" "}
              {totalRevenueTrend}%  
            </span>
            {periodLabel} <PriceDisplay amount={prevTotalRevenue} />
          </div>
        ))
      }
    >
      <span className="text-3xl font-bold"><PriceDisplay amount={totalRevenue} /></span>      
    </Card>
  )
}