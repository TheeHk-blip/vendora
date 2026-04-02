import { Card } from "@vendora/ui";
import Link from "next/link";
import { LinkOutlined, People } from "@mui/icons-material";
import { UserGrowth } from "./usergrowth";
import { TotalUsers } from "./usercount";

export async function Users() {
  const usercount = await TotalUsers();
  return (
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
      className="w-fit"
    >
      <span className="text-5xl font-bold">{usercount}</span>
      <UserGrowth />
    </Card>
  )
}