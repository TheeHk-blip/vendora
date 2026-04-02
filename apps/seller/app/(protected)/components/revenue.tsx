"use client";

import { TrendingDown, TrendingUp } from "@mui/icons-material";
import { Card } from "@vendora/ui";
import PriceDisplay from "@vendora/ui/src/components/priceDisplay";

interface RevenueProps {
  totalRevenue: number, 
  revenueTrend: number,
}

export function RevenueCard({totalRevenue, revenueTrend }: RevenueProps) {
  return (
    <Card      
      header={
        <div className="flex flex-col" >
          <span className="text-gray-600 dark:text-gray-400 " >Revenue</span>
          <PriceDisplay amount={totalRevenue} className="text-xl font-bold ml-3" />
        </div>        
      }
    >      
    {revenueTrend && revenueTrend > 0 ? (
      <div>
        <TrendingUp className="text-green-500" /> 
        <span className="text-green-500" > + {revenueTrend}% </span> 
        <span className="text-gray-600 dark:text-gray-400" >in past month</span>
      </div>      
    ):(
      <div>
        <TrendingDown className="text-red-500" /> 
        <span className="text-green-500" > + {revenueTrend}% </span> 
        <span className="text-gray-600 dark:text-gray-400" >in past month</span>
      </div>      
    )}
    </Card>
  )
}