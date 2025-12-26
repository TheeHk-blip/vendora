import { Analytics, Inventory, ShoppingBag, SpaceDashboard } from "@mui/icons-material";

export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  navLinks: [
    {
      label: "Dashboard",
      href: "/",
      icon: SpaceDashboard
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
    },
    {
      label: "Products",
      href: "/products",
      icon: Inventory
    }
  ]
}