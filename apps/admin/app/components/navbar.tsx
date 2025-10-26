"use client";

import { Logo, Navbar, SideBar, subtitle, ThemeToggle } from "@vendora/ui";
import Avatar from "@mui/material/Avatar";
import { Analytics, Home, Notifications, Settings, ShoppingBag } from "@mui/icons-material";
import { usePathname } from "next/navigation";
import Link from "next/link";

const navLinks = [  
    {
      label: "Dashboard",
      href: "/",     
      icon: <Home /> 
    },
    {
      label: "Analytics",
      href: "/analytics",
      icon: <Analytics />
    },
    {
      label: "Orders",
      href: "/orders",
      icon: <ShoppingBag />
    }      
  ]

export default function Navigation() {
  

  const pathname = usePathname();
  
  return (
    <SideBar    
      title={<span className={subtitle({ color: "violet", size: "sm" })}>vendora.com</span> }   
      brand={<Logo/>}                    
      actions={
        <>
          <Link
            href="/settings"
            className={`flex rounded-xl p-2 gap-2 items-center ${pathname.startsWith("/settings") ? "text-purple-600 bg-black/10 dark:bg-white/10 scale-107 transition-all duration-300 " : "bg-white/70 dark:bg-black/70 hover:bg-white/30 hover:dark:bg-black/30 hover:text-purple-600 scale-100"}`}
          >
            <Settings />
            Settings
          </Link>
        
          <span className="flex justify-between items-center rounded-xl bg-purple-400/40 dark:bg-orange-300/40 p-2" >
            Theme Switch
            <ThemeToggle />
          </span>
        </>
      }         
    >
      {navLinks.map((link) => {
        const isActive = pathname === link.href;
        return (
          <Link
            key={link.label}
            href={link.href}
            className={
              `
              flex flex-col rounded-xl p-2 mb-4 transition-all duration-300
              ${isActive ? "text-purple-500 bg-[#DE3163]/20 scale-107 transition-all duration-300 " : "bg-white/70 dark:bg-black/70 hover:bg-white/30 hover:dark:bg-black/30 hover:text-purple-600 scale-100"}              
              `
            }
          >
            <div className="flex gap-2 items-center" >
              {link.icon}
              <span>{link.label}</span>
            </div>            
          </Link>
        )
      })}
    </SideBar>
  )
}

export function Nav() {
  return (
    <Navbar 
      title={
        <span className="text-zinc-500 text-md">Welcome back <span className={subtitle({color: "violet", size: "sm"})}>Peter M.</span></span>
      }
      actions={      
        <span className="flex gap-2 items-center" >
          <Notifications />
          <Avatar />
        </span>
      }  
      variant="admin"    
    />
  )
}