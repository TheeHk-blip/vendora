import { Card } from "@vendora/ui";
import Link from "next/link";
import { LinkOutlined, People, TrendingUp } from "@mui/icons-material";
import { PlatformStats, TUsers } from "../data";
import TrendingDown from "@mui/icons-material/TrendingDown";
import { ComponentProps, getPeriodLabel } from "./revenue";

export async function Users({ range }: ComponentProps) {
  const totalUsers = await TUsers();
  const { monthlyTrend } = await PlatformStats(range)
  const periodLabel = getPeriodLabel(range);
  return (
    <Card
      header={
        <span className="flex flex-row text-gray-600 dark:text-gray-400 items-center justify-between" >
          Users
          <Link
            href="/user"
            className="flex flex-row rounded-2xl px-2 py-1 gap-2 active:scale-[0.98] transition-all duration-500 bg-black/15 dark:bg-white/15 hover:bg-black/25 hover:dark:bg-white/25"
          >
            <People />
            <LinkOutlined className="text-blue-600" />
          </Link>
        </span>
      }               
      footer={
        range === "all" ? (
          <div className="text-gray-500 text-sm mt-2 font-medium">Lifetime Users</div>
        ):(
        monthlyTrend && monthlyTrend > 0 ? (
          <div className="flex flex-row gap-2" >          
            <span className="text-green-500">
              <TrendingUp  /> {" "}
              +{monthlyTrend}%  
            </span>
            {periodLabel}
          </div>
        ):(
          <div className="flex flex-row gap-2" >          
            <span className="text-red-500">
              <TrendingDown  /> {" "}
              {monthlyTrend}%  
            </span>
            {periodLabel}
          </div>
        ))
      }
    >
      <span className="text-5xl font-bold">{totalUsers}</span>      
    </Card>
  )
}