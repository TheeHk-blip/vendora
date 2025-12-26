import { title } from "@vendora/ui";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Analytics | Vendora",
  description: "Get a clear picture of how your business is performing with precise analytics features."
}

export default function Analytics() {

  return(
    <div className="flex">
      <h1 className={title({color: "foreground"})}>Analytics</h1>
    </div>
  )
}