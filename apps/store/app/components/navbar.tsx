import { siteConfig } from "../config/site";
import { Limelight } from "next/font/google";
import Login from "@mui/icons-material/Login";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@vendora/auth";
import Profile from "./profile";
import Cart from "../cart/cart";
import { Navbar } from "@vendora/ui/src/components/Navbar";
import { title } from "@vendora/ui/src/primitives";
import { getInitials } from "@vendora/ui/src/utilities/getInitials";
import { ThemeToggle } from "@vendora/ui/src/providers/theme";
import { Logo } from "@vendora/ui";
import { Suspense } from "react";

const limeLight = Limelight({
  subsets: ["latin"],
  variable: "--font-limelight", 
  weight: ["400"] 
})

async function Nav() {
  const session = await getServerSession(authOptions);  

  return (
    <Navbar 
      app="store" 
      sticky={true}
      title={<span className={title({ color: "green", size: "sm", className: limeLight.className})}>Vendora</span>} 
      brand={<Logo width={50} height={50} />}     
      links={siteConfig.navLinks}
      menuToggle={
        <>                
          {session ? (
             <Profile src={session.user.image} initials={getInitials(session.user.name)} />
          ):(
            <Profile />
          )}              
          <Cart />                                     
        </>     
      }
      actions={
        <>          
          {session ? (            
            <Profile src={session.user.image} initials={getInitials(session.user.name)}  />
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
          <Cart />   
          <ThemeToggle />
        </>
      }
    />
  )
}

function NavSkeleton() {  
  return (
    <div className="h-12.5 px-1.5 md:px-2.5 md:py-2.5 w-full">
      <h1 className={title({ color: "green", size: "sm", className: limeLight.className})}>Vendora</h1>
    </div>
  )
}

export default function Navigation(){
  return (
    <Suspense fallback={<NavSkeleton />}>
      <Nav />
    </Suspense>
  )
}