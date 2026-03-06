"use client";

import { SideNav } from "@vendora/ui/src/components/sidenav";
import { useDrawer } from "@vendora/ui/src/context/drawerContext";
import Close from "@mui/icons-material/Close";
import Login from "@mui/icons-material/Login";
import { siteConfig } from "../config/site";
import Link from "next/link";
import { ThemeToggle } from "@vendora/ui/src/providers/theme";
import Menu from "@mui/icons-material/Menu";

export function DrawerTrigger() {
  const { openDrawer, closeDrawer} = useDrawer();
  return (
    <>
    <button
      onClick={() => openDrawer("menu")}
      className="cursor-pointer"
      aria-label="Menu button"
    >
      <Menu />
    </button>
    <SideNav
      id="menu"
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
          <Link 
            href={"/signin"} 
            onClick={() => closeDrawer()} 
            className="p-1.5 space-x-2.5 text-blue-600 ring rounded-lg hover:bg-blue-600 hover:text-foreground transition-colors duration-300 " 
          >
            <Login />
            <span>Sign in</span>
          </Link>
          <span className="flex gap-2.5 text-gray-600 dark:text-gray-300 bg-foreground/15 px-2 py-1 rounded-xl justify-between" >
            Switch theme
            <ThemeToggle />
          </span>          
        </>   
      }
    />
    </>
  )
}