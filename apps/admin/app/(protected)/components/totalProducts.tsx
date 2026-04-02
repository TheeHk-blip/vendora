import { Card } from "@vendora/ui";
import Link from "next/link";
import { LinkOutlined, ShoppingBag } from "@mui/icons-material";
import { TotalProducts } from "./productCount";

export async function VProducts() {
  const liveProducts = TotalProducts();
  return (
    <Card          
      header={
        <span className="flex flex-row text-gray-600 dark:text-gray-400 items-center justify-between gap-2.5" >
          Products
          <Link
            href="/products"
            className="flex flex-row rounded-2xl px-2 py-1 gap-2 active:scale-[0.98] transition-all duration-500 bg-black/15 dark:bg-white/15 hover:bg-black/25 hover:dark:bg-white/25"
          >
            <ShoppingBag />
            <LinkOutlined className="text-blue-600" />
          </Link>
        </span>
      }         
      className="w-fit"
    >
      <span className="text-5xl font-bold">{liveProducts}</span>          
    </Card>
  )
}