import { authOptions } from "@vendora/auth";
import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";


export const metadata: Metadata = {
  title: "Dashboard | Vendora",
  description: "Tools designed to help your business scale and be profitable."
}


export default async function IndexPage() {
  const session = await getServerSession(authOptions);

    if (!session || !session?.user) {
      redirect(`${process.env.BASE_URL}/signin`)
    }
  
    if (session.user.role !== "admin") {
      redirect("/unauthorized");
    }

    redirect("/home");
}