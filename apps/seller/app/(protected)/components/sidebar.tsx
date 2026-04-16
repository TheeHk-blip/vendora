"use client";

import { Button, getInitials, Logo, Navbar, ThemeToggle } from "@vendora/ui";
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
      title={<span className="px-1 py-1 rounded-lg ring" >{getInitials(session?.user.name as string)}</span>}
      links={siteConfig.navLinks}
      actions={
        <>          
          <Link
            href="/settings"
            className={`flex rounded-md px-2 py-1 gap-2 items-center transition-all duration-300 ${pathname.startsWith("/settings") 
              ? "text-purple-700 bg-purple-500/15 dark:bg-purple-400/10 scale-105 -translate-y-1 -translate-x-1" 
              : "text-neutral-700 dark:text-neutral-400 hover:text-purple-700 dark:hover:text-purple-700 hover:bg-white/50 dark:hover:bg-black/50"}`
            }
          >
            <Settings />
            Settings
          </Link>
          <span className="flex flex-row justify-between items-center rounded-md px-1.5 py-1 ring text-zinc-800 dark:text-orange-500 " >
            Theme Switch
            <ThemeToggle />
          </span>          
          {session ? (
            <Button
              onClick={() => signOut({callbackUrl: process.env.NEXT_PUBLIC_BASE_URL})}
              color="danger"
              size="sm"
              radius="md"
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