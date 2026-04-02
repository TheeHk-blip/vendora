import { Card } from "@vendora/ui";
import { getSellerStats } from "../utilities/data-fetcher";
import { StarRate, TrendingDown, TrendingUp } from "@mui/icons-material";

export async function Performance() {
  const { rating, totalReviews, reviewTrend } = await getSellerStats();

  return (
    <Card
      header={
        <div className="flex flex-col">
          <span className="text-gray-600 dark:text-gray-400 " >Performance</span>
          <div>
            <span className="flex flex-row gap-2.5 ml-3" >
              <span>Average Rating:</span>
              <span className="font-bold text-gray-600 dark:text-gray-400 items-center">{rating} <StarRate className="text-purple-700 mb-1.5" sx={{ width: 20, height: 20 }} /></span>
            </span>
            <span className="flex flex-row gap-2 ml-3" >
              <span>Total Reviews:</span>
              <span className="font-bold text-gray-600 dark:text-gray-400" >{totalReviews}</span>
            </span>
          </div>
        </div>
      }
    >
      {reviewTrend && reviewTrend > 0 ? (
        <div>
          <TrendingUp className="text-green-500" />
          <span className="text-green-500"> + {reviewTrend}% </span>
          <span className="text-gray-600 dark:text-gray-400">in past month</span>
        </div>
      ):(
        <div>
          <TrendingDown className="text-red-500" />
          <span className="text-red-500"> - {reviewTrend}% </span>
          <span className="text-gray-600 dark:text-gray-400">in past month</span>
        </div>
      )}
    </Card>
  )
}