import { connectDB } from "@vendora/db";
import User from "@vendora/db/src/models/user";
import UserClient from "./components/userclient";
import { Users } from "@vendora/ui";

interface UsersProps {
  searchParams: {
    q?: string;
    page?: string;
    pageSize?: string
  };
}

export default async function VUsers({ searchParams }: UsersProps) {
  await connectDB();
  const params = await searchParams;
  const query = String(params.q || "").trim();
  const page = parseInt(params.page || "1", 10);
  const pageSize = parseInt(params.pageSize || "10", 10);

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