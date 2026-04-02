import OrderClient from "./components/orderobject";
import { getSellerStats } from "../utilities/data-fetcher";
import { title } from "@vendora/ui";

export default async function Orders() {
  const { orders } = await getSellerStats()
  return(
    <div className="flex flex-col justify-center gap-3.5" >
      <h1 className={title({})}>Orders</h1>
      <OrderClient order={orders} />
    </div>
  )
}

