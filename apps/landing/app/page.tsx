import { auth } from "@vendora/auth";
import { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Index | Vendora",
  description: ""
}

export default async function IndexPage() {
  const session = await auth();

  if (!session || !session.user) {
    redirect("/home")
  }

  if (!session.user.role) {
    redirect("/dashboard")
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