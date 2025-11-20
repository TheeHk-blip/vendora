import { Metadata } from "next";
import Pricing from "./components/pricing";

export const metadata: Metadata = ({
  title: "Pricing | Vendora",
  description: "Choose the right plan for your business"
})

export default function PricingPage() {
  return <Pricing />
}
