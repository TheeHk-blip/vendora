import { title } from "@vendora/ui";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Unauthorized | Admin",
  description: "Non-Admins's are not allowed to access this app"
}

export default function Unauthorized() {
  return (
    <main className="flex flex-col justify-center items-center my-auto h-screen" >
      <h1 className={title({size: "md"})}>Unauthorized Page</h1>    
      <Link
        href={`${process.env.NEXT_PUBLIC_BASE_URL}/onboarding`}
        className="text-2xl text-blue-600 hover:underline"
      >
        Home
      </Link>    
    </main>
  )
}