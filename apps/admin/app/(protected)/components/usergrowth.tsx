import { TrendingDown, TrendingUp } from "@mui/icons-material";
import { WeeklyUserStats } from "./usercount";

export async function UserGrowth() {
  const trend = await WeeklyUserStats();
  const trendUp = trend >= 0;

  return(
    <div className="flex flex-col gap-1">
      <div className="flex flex-row gap-1">
        {trendUp ? (
          <TrendingUp className="text-green-600" />
        ):(
          <TrendingDown className="text-red-600" />
        )}
        <span
          className={`font-semibold ${
            trendUp ? "text-green-500" : "text-red-500"
          }`}
        >
          {trend}%       
        </span>
      </div>
      <span className="text-sm text-gray-700 dark:text-gray-400 ">Compared to last week</span>
    </div>
  )
}