import { authOptions } from "@vendora/auth";
import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";


export const metadata: Metadata = {
  title: "Admin | Vendora",
  description: "Oversee sellers, buyers, products, and performance metrics with Vendora's all-in-one admin dashboard."
}


export default async function IndexPage() {
  const session = await getServerSession(authOptions);

  if (session?.user.role !== "admin") {
    redirect("/unauthorized")
  }

  redirect("/dashboard")
}