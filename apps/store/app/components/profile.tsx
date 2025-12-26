"use client";

import { Close, Logout } from "@mui/icons-material";
import { Button, SideNav, useDrawer } from "@vendora/ui";
import { signOut } from "next-auth/react";
import { siteConfig } from "../config/site";
import Image from "next/image";

interface ProfileProps {
  src: string;
}

export default function Profile({src}: ProfileProps) {
  const { openDrawer, closeDrawer } = useDrawer();
  return (
    <>
      <Image 
        src={src} 
        alt={"profile picture"}
        width={30}
        height={30}
        onClick={() => openDrawer("profile")}         
        className="cursor-pointer rounded-full" 
      />
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
            <Button
              color="danger"
              onClick={() => signOut({ callbackUrl: "/"})}
              className="gap-2"
            >
              Log out
              <Logout />
            </Button>
          </>
        }
      />
    </>
  )
}
