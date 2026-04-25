import Notifications from "@mui/icons-material/Notifications"
import { Logo, Navbar, ThemeToggle, title } from "@vendora/ui"
import { Limelight } from "next/font/google"

const limeLight = Limelight({
  subsets: ["latin"],
  variable: "--font-limelight", 
  weight: ["400"] 
})

export function Navigation() {
  return (
    <Navbar 
      app="landing"
      brand={<Logo width={50} height={50} />}
      title={<span className={title({ color: "blue", size: "sm", className: limeLight.className})}>Vendora</span>} 
      actions={
        <>
          <Notifications className="text-black/60 dark:text-white/70" />
          <ThemeToggle />
        </>        
      }
    />
  )
}