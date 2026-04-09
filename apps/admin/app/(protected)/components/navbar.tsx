"use client";

import { getInitials, Logo, Navbar } from "@vendora/ui";
import { Notification } from "./notifications";
import { siteConfig } from "../config/site";
import Profile from "./profile";
import { useSession } from "next-auth/react";

export default function Nav() {
  const { data: session } = useSession();
  return (
    <Navbar 
      app="adminnav"   
      brand={<Logo width={50} height={50} />}
      menuToggle={<Profile src={session?.user.image} initials={getInitials(session?.user.name || "")} />}      
      links={siteConfig.navLinks}
      actions={      
        <span className="flex gap-2 items-center" >
          <Notification />      
        </span>
      }              
    />
  )
}