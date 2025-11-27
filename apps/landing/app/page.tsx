import { authOptions } from "@vendora/auth";
import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Vendora - Redirecting...",
  description: "Redirecting to the appropriate dashboard based on your role."
}

export default async function Index() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect("/home")
  };

  if (!session.user.role) {
    redirect("/onboarding");
  }

  switch (session.user.role) {
    case "buyer":
      redirect(`${process.env.NEXT_PUBLIC_STORE_URL}`);
    case "seller":
      redirect(`${process.env.NEXT_PUBLIC_SELLER_URL}`);
    case "admin":
      redirect(`${process.env.NEXT_PUBLIC_ADMIN_URL}`);
    default:
      redirect("/home");
  }
}