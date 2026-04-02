import { Card } from "@vendora/ui";
import { getSellerStats } from "../utilities/data-fetcher";
import { RecentsTable } from "./recentorderstable";

export async function RecentOrders() {  
  const { recentOrdersData } = await getSellerStats();
  return (
    <Card
      header={
        <span className="text-gray-600 dark:text-gray-300 font-semibold">Your recent orders</span>
      }
    >
      <RecentsTable data={recentOrdersData} />
    </Card>
  )
}