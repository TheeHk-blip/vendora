"use client";

import { Button, Logo, Navbar, ThemeToggle } from "@vendora/ui";
import { siteConfig } from "../config/site";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { Logout, Settings } from "@mui/icons-material";


export default function SideBar() {
  const pathname = usePathname();
  const { data: session} = useSession();
  return (
    <Navbar 
      app="admin"
      brand={<Logo width={50} height={50} />}
      links={siteConfig.navLinks}
      actions={
        <>
          {session ? (
            <Button
              onClick={() => signOut({callbackUrl: process.env.NEXT_PUBLIC_BASE_URL})}
              color="danger"
              className="flex gap-2 items-center"
            >
              Log Out
              <Logout />
            </Button>
          ):(
            <></>
          )}
          <Link
            href="/settings"
            className={`flex rounded-[14px] px-3 py-2 gap-2 items-center transition-all duration-300 ${pathname.startsWith("/settings") 
              ? "text-violet-600 bg-purple-400/20 dark:bg-purple-400/30 scale-105 -translate-y-1 -translate-x-1" 
              : "bg-white/25 hover:text-violet-600 hover:bg-purple-200/70 dark:bg-black/40 dark:hover:bg-black/20"}`
            }
          >
            <Settings />
            Settings
          </Link>
          <span className="flex flex-row justify-between items-center rounded-[14px] bg-purple-400/45 dark:bg-orange-300/40 px-3 py-2" >
            Theme Switch
            <ThemeToggle />
          </span>
        </>
      }
    />
  )
}