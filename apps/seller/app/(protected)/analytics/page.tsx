import { Card, title } from "@vendora/ui";
import { getSellerStats } from "../utilities/data-fetcher";
import { SalesChart } from "../components/salesChart";


export default async function Analytics() {
  const { chartData } = await getSellerStats()
  return(
    <div>
      <h1 className={title({ color: 'foreground'})}>Analytics</h1>
      <Card
        header={
          <span className="text-3xl text-gray-600 dark:text-gray-400" >Sales over time</span>
        }
        className="my-2.5"
      >
        <SalesChart data={chartData} />
      </Card>
    </div>
  )
}