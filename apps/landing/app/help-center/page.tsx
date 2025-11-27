import { Metadata } from "next";
import HelpCenter from "./components/help";

export const metadata: Metadata = {
  title: "Help Center | Vendora",
  description: "Explore FAQs, guides, and support resources to manage your Vendora account and dashboard.",
}

export default function HelpCenterPage() {
  return <HelpCenter />
}