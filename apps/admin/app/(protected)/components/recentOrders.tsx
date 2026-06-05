import { Card } from "@vendora/ui";
import { PlatformStats } from "../data";
import { RecentsTable } from "./recentOrdersTable";
import { ComponentProps } from "./revenue";


export async function RecentOrders({ range }: ComponentProps) {
  const { recentOrdersData } = await PlatformStats(range);
  return (
    <Card
       header={
        <span className="text-gray-600 dark:text-gray-300">Recent Orders</span>
      }
    >
      <RecentsTable data={recentOrdersData} />
    </Card>
  )
}