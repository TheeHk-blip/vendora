import { Card } from "@vendora/ui";
import { getSellerStats } from "../utilities/data-fetcher";
import { TrendingDown, TrendingUp } from "@mui/icons-material";

export async function Customers() {
  const { customers, customerTrend } = await getSellerStats();

  return (
    <Card
      header={
        <div className="flex flex-col" >
          <span className="text-gray-600 dark:text-gray-400 " >Customers</span>
          <span className="text-2xl font-bold ml-3">{customers}</span>
        </div> 
      }
    >
      {customerTrend && customerTrend > 0 ? (
        <div>
          <TrendingUp className="text-green-500" /> 
          <span className="text-green-500" > + {customerTrend}% </span> 
          <span className="text-gray-600 dark:text-gray-400" >in past month</span>
        </div> 
      ):(
        <div>
          <TrendingDown className="text-red-500" /> 
          <span className="text-red-500" > - {customerTrend}% </span> 
          <span className="text-gray-600 dark:text-gray-400" >in past month</span>
        </div>
      )}
    </Card>
  )
}