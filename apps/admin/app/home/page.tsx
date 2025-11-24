import { Card } from "@vendora/ui";
import { Metadata } from "next";
import { TotalUsers } from "../components/usercount";
import { LinkOutlined, People } from "@mui/icons-material";
import { UserGrowth } from "../components/usergrowth";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Dashboard | Vendora",
  description: "Tools designed to help your business scale and be profitable."
}

export const dynamic = "force-dynamic"

export default async function DashboardPage() {
  const totalUsers = await TotalUsers();
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 max-w-full">
      <div className="grid grid-cols-1 lg:grid-cols-2">
        <Card
          header={
            <span className="flex flex-row text-gray-600 dark:text-gray-400 items-center justify-between" >
              Users
              <Link
                href="/user"
                className="flex flex-row rounded-2xl px-2 py-1 gap-2 active:scale-[0.98] transition-all duration-500 bg-black/15 dark:bg-white/15 hover:bg-black/25 hover:dark:bg-white/25"
              >
                <People />
                <LinkOutlined className="text-blue-600" />
              </Link>
            </span>
          }         
        >
          <span className="text-5xl font-bold">{totalUsers}</span>
          <UserGrowth />
        </Card>
      </div>
    </div>
  )
}