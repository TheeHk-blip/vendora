import { connectDB } from "@vendora/db";
import User from "@vendora/db/src/models/user";
import UserClient from "./components/userclient";
import { Users } from "@vendora/ui";
import { Metadata } from "next";

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
    <div className="">
      <UserClient users={safeUsers} />
    </div>
  )
}