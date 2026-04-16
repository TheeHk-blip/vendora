import { connectDB, User } from "@vendora/db/frontend";
import UserClient from "./components/userclient";
import { Card, Users } from "@vendora/ui";
import { Metadata } from "next";
import { PlatformStats } from "../data";
import { ShoppingBag, Store } from "@mui/icons-material";

export const metadata: Metadata = {
  title: "Users | Vendora",
  description: ""
}

export default async function VUsers({ searchParams }:{
  searchParams: Promise<{
    q?: string;
    page?: string;
    pageSize?: string;
  }>
}) {
  await connectDB();

  const { buyers, sellers } = await PlatformStats();
  const params = await searchParams;
  const query = String(params?.q ?? "").trim();
  const page = Number(params?.page ?? 1);
  const pageSize = Number(params?.pageSize ?? 10);

  const filter = query
    ?{
        $or: [
          { name: { $regex: query, $options: "i" } },
          { email: { $regex: query, $options: "i" } }
        ]
      }
    :{};

  const users = await User.find(filter)
    .select("name email role")
    .skip((page -1) * pageSize)
    .limit(pageSize)
    .lean();
    
  const safeUsers: Users[] = users.map(user => ({
    _id: String(user._id),
    name: user.name,
    email: user.email,
    role: user.role
  }))

  return(
    <div className="grid grid-cols-2 gap-4">      
      <Card
        header={
          <span className="flex flex-row text-gray-600 dark:text-gray-400 items-center justify-between" >
            Buyers
            <ShoppingBag />
          </span>
        }
      >
        <span className="text-5xl font-bold">{buyers}</span>
      </Card>
      <Card
        header={
          <span className="flex flex-row text-gray-600 dark:text-gray-400 items-center justify-between" >
            Sellers
            <Store />
          </span>
        }
      >
        <span className="text-5xl font-bold">{sellers}</span>
      </Card>
      <div className="col-span-2">
        <UserClient users={safeUsers} />
      </div>      
    </div>
  )
}