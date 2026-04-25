import { Logo, Navbar } from "@vendora/ui";
import { ChatFeature } from "./chatfeature";
import { Avatar } from "@mui/material";

export function SideNavigation() {
  return (
    <Navbar 
      app="admin"
      brand={
        <>
          <Logo width={50} height={50} />
          <Avatar sx={{ width: 30, height: 30 }} />
        </>        
      }
      search={
        <ChatFeature />
      }      
    />
  )
}