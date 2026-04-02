import { Analytics, Inventory, ShoppingBag, SpaceDashboard, Subscriptions } from "@mui/icons-material";

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
      href: "/product",
      icon: Inventory
    },
    {
      label: "Subscription",
      href: "/subscription",
      icon: Subscriptions
    }
  ]
}