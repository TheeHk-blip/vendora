import { Card } from "@vendora/ui";
import { PlatformStats } from "../data";
import Link from "next/link";
import { LinkOutlined, MonetizationOn } from "@mui/icons-material";
import TrendingUp from "@mui/icons-material/TrendingUp";
import TrendingDown from "@mui/icons-material/TrendingDown";
import PriceDisplay from "@vendora/ui/src/components/priceDisplay";

export async function PlatformRevenue() {
  const { platformRevenue, totalRevenueTrend } = await PlatformStats();
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
    >
      <span className="text-3xl font-bold"><PriceDisplay amount={platformRevenue} /></span>
      {totalRevenueTrend && totalRevenueTrend > 0 ? (
        <div className="flex flex-row gap-2" >          
          <span className="text-green-500">
            <TrendingUp  /> {" "}
            +{totalRevenueTrend}%  
          </span>
          in past month
        </div>
      ):(
        <div className="flex flex-row gap-2" >          
          <span className="text-red-500">
            <TrendingDown  /> {" "}
            -{totalRevenueTrend}%  
          </span>
          in past month
        </div>
      )}
    </Card>
  )
}

export async function TotalRevenue() {
  const {totalRevenue, totalRevenueTrend} = await PlatformStats();
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
    >
      <span className="text-3xl font-bold"><PriceDisplay amount={totalRevenue} /></span>
      {totalRevenueTrend && totalRevenueTrend > 0 ? (
        <div className="flex flex-row gap-2" >          
          <span className="text-green-500">
            <TrendingUp  /> {" "}
            +{totalRevenueTrend}%  
          </span>
          in past month
        </div>
      ):(
        <div className="flex flex-row gap-2" >          
          <span className="text-red-500">
            <TrendingDown  /> {" "}
            -{totalRevenueTrend}%  
          </span>
          in past month
        </div>
      )}
    </Card>
  )
}