import { Card } from "@vendora/ui";
import { PlatformStats } from "../data";
import { RecentsTable } from "./recentOrdersTable";


export async function RecentOrders() {
  const { recentOrdersData } = await PlatformStats();
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