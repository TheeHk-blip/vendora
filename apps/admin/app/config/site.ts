import { Analytics, Home, ShoppingBag } from "@mui/icons-material";

export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  navLinks: [
    {
      label: "Dashboard",
      href: "/",     
      icon: Home 
    },
    {
      label: "Analytics",
      href: "/analytics",
      icon: Analytics
    },
    {
      label: "Orders",
      href: "/orders",
      icon: ShoppingBag
    }
  ]
}