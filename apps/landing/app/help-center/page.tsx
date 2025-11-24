import { Metadata } from "next";
import HelpCenter from "./components/help";

export const metadata: Metadata = {
  title: "Help Center | VEndora",
  description: "Get assistance and find answers to your questions in the Vendora Help Center.",
}

export default function HelpCenterPage() {
  return <HelpCenter />
}