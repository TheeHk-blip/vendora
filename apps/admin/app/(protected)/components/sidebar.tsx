"use client";

import { Button, getInitials, Logo, Navbar, ThemeToggle } from "@vendora/ui";
import { Logout, Settings } from "@mui/icons-material";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { siteConfig } from "../config/site";

export default function Navigation() {
  const pathname = usePathname();
  const { data: session } = useSession();
  
  return (
    <Navbar  
      app="admin"  
      brand={
        <div className="flex flex-row justify-between w-full items-center">
          <Logo width={50} height={50} />
          <span className="px-2 py-1 rounded-lg ring" >{getInitials(session?.user.name as string)}</span>
        </div>
      }
      links={siteConfig.navLinks}    
      actions={      
        <>          
          <Link
            href="/settings"
            className={`flex rounded-md px-2 py-1 gap-2 items-center transition-all duration-300 ${pathname.startsWith("/settings") 
              ? "text-violet-600 bg-purple-400/20 dark:bg-purple-400/30 scale-105 -translate-y-1 -translate-x-1" 
              : "text-neutral-700 dark:text-neutral-400 hover:text-violet-600 hover:bg-white/50 dark:hover:bg-black/50"}`
            }
          >
            <Settings />
            Settings
          </Link>
        
          <span className="flex flex-row justify-between items-center rounded-md px-1.5 py-1 ring text-zinc-800 dark:text-orange-500" >
            Theme Switch
            <ThemeToggle />
          </span>
          {session ? (
            <Button            
              onClick={() => signOut({callbackUrl: process.env.NEXT_PUBLIC_BASE_URL})}  
              color="danger"     
              size="sm"
              radius="md"
              rightIcon={<Logout />}         
            >
              Log out
            </Button>
          ):(
            <></>
          )}
        </>
      }         
    />
  )
}