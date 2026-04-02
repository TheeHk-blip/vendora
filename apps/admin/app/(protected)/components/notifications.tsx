"use client";
import { Notifications } from "@mui/icons-material";
import { Button, SideNav, useDrawer } from "@vendora/ui";

export function Notification() {
  const {openDrawer, closeDrawer} = useDrawer();
  return (
    <main className="flex w-full">
      <div className="relative" >
        <Button
          onClick={() => openDrawer("notification")}
        >
          <Notifications />
        </Button>
        <div className="absolute top-0 right-0.5 flex">
          <span className="text-orange-500 bg-orange-200 rounded-full text-xs px-1.5 py-0.5">1</span>
        </div>
      </div>      
      <SideNav 
        id="notification"
        variant="glass"
        closeButton={
          <Button
            onClick={closeDrawer}
          >
            X
          </Button>
        }
      />            
    </main>
  )
}