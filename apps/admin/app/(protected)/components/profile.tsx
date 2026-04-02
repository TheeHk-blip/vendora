"use client";

import AccountCircle from "@mui/icons-material/AccountCircle";
import Close from "@mui/icons-material/Close";
import Login from "@mui/icons-material/Login";
import Logout from "@mui/icons-material/Logout";
import { signOut, useSession } from "next-auth/react";
import { siteConfig } from "../config/site";
import Image from "next/image";
import Link from "next/link";
import { useDrawer } from "@vendora/ui/src/context/drawerContext";
import { Button } from "@vendora/ui/src/components/Button";
import { SideNav } from "@vendora/ui/src/components/sidenav";
import { ThemeToggle } from "@vendora/ui/src/providers/theme";

interface ProfileProps {
  src?: string;  
  initials?: string;
}

export default function Profile({src, initials}: ProfileProps) {
  const { openDrawer, closeDrawer } = useDrawer();
  const { status } = useSession();

  const isAuthenticated = status === "authenticated";

  return (
    <>
      {src ? (
        <Image 
          src={src as string} 
          alt={"profile picture"}
          width={30}
          height={30}
          onClick={() => openDrawer("profile")}         
          className="cursor-pointer rounded-full" 
        />
      ): initials ? (
        <Button
          onClick={() => openDrawer("profile")}
          className="font-medium rounded-full ring text-xs text-gray-600 dark:text-gray-400"
        >
          {initials}
        </Button>
      ): (
        <AccountCircle 
          onClick={() => openDrawer("profile")}
          className="cursor-pointer"
        />
      )}      
      <SideNav
        id="profile"
        variant="glass"
        closeButton={
          <button
            onClick={() => closeDrawer()}
          >
            <Close />
          </button>
        }
        links={siteConfig.navLinks}
        actions={        
          <>  
            <span className="flex flex-row justify-between items-center ring px-2 py-1 rounded-lg text-gray-500" >
              Switch Theme
              <ThemeToggle />  
            </span>
                    
            {isAuthenticated ? (
              <Button
                color="danger"
                onClick={() => signOut({ callbackUrl: "/"})}
                className="gap-2"
              >
                Log out
                <Logout />
              </Button>
            ):(
              <Link href={`${process.env.NEXT_PUBLIC_BASE_URL}/signin`} className="w-full">
                <Button
                  color="primary"              
                  className="gap-2 w-full"
                >
                  <Login />
                  Sign In              
                </Button>
              </Link> 
            )}     
          </>           
        }
      />
    </>
  )
}
