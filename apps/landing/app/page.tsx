import { authOptions } from "@vendora/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";


export default async function Index() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect("/home")
  }

  if (!session.user.role) {
    redirect("/onboarding")
  }

  switch (session.user.role) {
    case "buyer":
      redirect(process.env.NEXT_PUBLIC_STORE_URL as string);
    case "seller":
      redirect(process.env.NEXT_PUBLIC_SELLER_URL as string);
    case "admin":
      redirect(process.env.NEXT_PUBLIC_ADMIN_URL as string);
    default:
      redirect("/home")
  }
}