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
          <Link
            href="/settings"
            className={`flex rounded-[14px] px-3 py-1.5 gap-2 items-center transition-all duration-300 ${pathname.startsWith("/settings") 
              ? "text-purple-700 bg-purple-500/15 dark:bg-purple-400/10 scale-105 -translate-y-1 -translate-x-1" 
              : "text-neutral-700 dark:text-neutral-400 bg-black/15 hover:text-purple-700 dark:bg-black/50 dark:hover:bg-black/20"}`
            }
          >
            <Settings />
            Settings
          </Link>
          <span className="flex flex-row justify-between items-center rounded-[14px] ring text-zinc-800 dark:text-orange-500 px-3 py-1" >
            Theme Switch
            <ThemeToggle />
          </span>
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
            <Button>
            </Button>
          )}
        </>
      }
    />
  )
}