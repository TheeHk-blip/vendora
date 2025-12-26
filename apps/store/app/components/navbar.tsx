import { Navbar, ThemeToggle, title } from "@vendora/ui";
import { siteConfig } from "../config/site";
import { Limelight } from "next/font/google";
import { Login } from "@mui/icons-material";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@vendora/auth";
import Profile from "./profile";
import Cart from "./cart";
import { Avatar } from "@mui/material";

const limeLight = Limelight({
  subsets: ["latin"],
  variable: "--font-limelight", 
  weight: ["400"] 
})

export default async function Navigation() {
  const session = await getServerSession(authOptions); 

  return (
    <Navbar 
      app="store" 
      sticky={true}
      title={<span className={title({ color: "green", size: "sm", className: limeLight.className})}>Vendora</span>}      
      links={siteConfig.navLinks}
      menuToggle={
        <>
          {session ? (
            <Profile src={session.user.image!} />
          ):(
            <Avatar />
          )}
        </>     
      }
      actions={
        <>
          <Cart />
          {session ? (            
            <>
              <Profile src={session.user.image!} />              
            </>
          ):(
            <>
              <Link 
                href={`${process.env.NEXT_PUBLIC_BASE_URL}/onboarding`}
                className="flex items-center rounded-2xl text-sm px-2 py-1 bg-black/10 dark:bg-white/10 
                hover:bg-black/25 dark:hover:bg-white/25 hover:scale-102 active:scale-98 transition-all duration-300 "
              >
                Sign up
              </Link>
              <Link
                href={`${process.env.NEXT_PUBLIC_BASE_URL}/signin`}
                className="flex flex-row items-center rounded-2xl text-base px-2 py-1.5 gap-2 bg-green-600/40 
                hover:bg-green-600/60 hover:scale-102 active:scale-98 transition-all duration-300"
              >
                <Login />
                Sign in
              </Link>
            </>
          )}          
          <ThemeToggle />
        </>
      }
    />
  )
}