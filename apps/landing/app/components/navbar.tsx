import Link from "next/link";
import { siteConfig } from "../config/site";
import { DrawerTrigger } from "./drawerTrigger";
import { Navbar } from "@vendora/ui/src/components/Navbar";
import { subtitle } from "@vendora/ui/src/primitives";
import { ThemeToggle } from "@vendora/ui/src/providers/theme";
import { limelight } from "../layout";
import { Logo } from "@vendora/ui/src/components/logo";

export default function Navigation() {
  return(
    <>
      <Navbar  
        app="landing"             
        title={<span className={subtitle({color: "blue", size: "xl", className: limelight.className })}>Vendora</span>}        
        brand={<Logo width={50} height={50} />}
        links={siteConfig.navLinks}        
        menuToggle={<DrawerTrigger />}        
        actions={
          <>            
            <Link
              href={"/signin"}
              className="px-2 py-1 rounded-[14px] text-blue-600 ring hover:bg-blue-600 hover:text-foreground hover:ring-0
              transition-all duration-300 flex items-center active:scale-95"
            >
              Sign in
            </Link>                
            <ThemeToggle />                 
          </>                
        }        
      />
    </>
  )
} 