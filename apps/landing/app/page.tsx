import { authOptions } from "@vendora/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";


export default async function Index() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect("/home")
  }

  switch (session.user.role) {
    case "buyer":
      redirect("http://localhost:3001/");
    case "seller":
      redirect("http://localhost:3002/");
    case "admin":
      redirect("http://localhost:3003/");
    default:
      redirect("/home");
  }
}