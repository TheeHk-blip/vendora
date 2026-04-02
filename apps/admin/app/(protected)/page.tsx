import { Metadata } from "next";
import { Users } from "./components/totalUsers";
import { VProducts } from "./components/totalProducts";

export const metadata: Metadata = {
  title: "Dashboard | Vendora",
  description: "Tools designed to help your business scale and be profitable."
}

export default async function DashboardPage() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2  max-w-full">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-2.5">
        <Users />
        <VProducts />
      </div>
    </div>
  )
}