import { title } from "@vendora/ui/src/primitives";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Unauthorized | Seller",
  description: "Non-Seller's are not allowed to access this app"
}

export default function UnauthorizedPage() {
  return(
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