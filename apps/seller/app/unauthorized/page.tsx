import { AppBlocking, ArrowRight } from "@mui/icons-material";
import { Card, title } from "@vendora/ui";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Unauthorized | Seller",
  description: "Non-Seller's are not allowed to access this app"
}

export default function Unauthorized() {
  return (
    <main className="max-w-7xl flex justify-center items-center h-screen my-auto px-10 py-10" >
      <Card 
        variant="glass"
        header={
          <div className="flex flex-col gap-2 items-center justify-center">    
            <span className={title({ color: "yellow", size: "md"})}>Access Denied</span> 
            <span className="text-neutral-400 font-semibold">You&apos;re not authorized to view this App</span>      
          </div>
        }
        footer={
          <Link 
            href={`${process.env.NEXT_PUBLIC_BASE_URL}`}
            className="flex flex-row items-center justify-center text-blue-500"
          >
            Go Home
            <ArrowRight />
          </Link>
        }
      >
        <div className="flex justify-center text-red-500" >          
          <AppBlocking />
        </div>        
      </Card>
    </main>
  )
}