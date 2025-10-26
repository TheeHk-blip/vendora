"use client";

import { Close, Login, Menu } from "@mui/icons-material";
import Link from "next/link";
import { Limelight } from "next/font/google";

import { Button, Navbar, subtitle, ThemeToggle, useDrawer, SideNav } from "@vendora/ui"
import { siteConfig } from "../config/site";

const limelight = Limelight({ 
  subsets: ["latin"],
  variable: "--font-limelight", 
  weight: ["400"] 
});

export default function Navigation() {
  const { openDrawer, closeDrawer } = useDrawer();
  return(
    <>
      <Navbar               
        title={<span className={subtitle({color: "blue", size: "xl", className: limelight.className})}>Vendora</span>}        
        links={siteConfig.navLinks}
        menuToggle={
          <button
            onClick={() => openDrawer()}
            className="cursor-pointer"
          >
            <Menu />
          </button>
        }
        actions={
          <>            
            <Link
              href={"/signin"}
              className="px-2 py-1 rounded-lg text-blue-600 ring hover:bg-blue-600 hover:text-white hover:ring-0 transition-all duration-300 flex items-center"
            >
              Sign in
            </Link>                
            <ThemeToggle />                 
          </>                
        }        
      />

      <SideNav
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
            <Button variant="flat">Get Started</Button>
            <Link href={"/signin"} className="p-1.5 space-x-2 text-blue-600 ring rounded-lg hover:bg-blue-500 transition-colors duration-300 " >
              <Login />
              <span>Sign in</span>
            </Link>
            <span className="flex justify-between items-center p-1 ring text-gray-700 dark:text-blue-700 rounded-lg">
              Switch Theme
              <ThemeToggle />
            </span>
          </>   
        }
      />
    </>
  )
} 