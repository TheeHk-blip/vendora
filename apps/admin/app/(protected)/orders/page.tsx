import { title } from "@vendora/ui";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Orders | Vendora",
  description: "Access all  your orders - active, pending and cancelled ones."
}

export default function Orders() {

  return (
    <div className="flex">
      <h1 className={title({ color: "foreground" })}>Orders</h1>
    </div>
  )
}