import { Metadata } from "next";
import BuiltForEveryone from "../components/builtforall";
import FeaturesSection from "../components/features";
import Footer from "../components/footer";
import Hero from "../components/hero";
import HowVendoraWorks from "../components/howvendoraworks";

export const metadata: Metadata = {
  title: "Home | Vendora",
  description: "Welcome to vendora"
}

export default function Home() {
  return (
    <div className="flex flex-col justify-center w-full max-w-7xl mx-auto px-2 py-2">
      <Hero />
      <BuiltForEveryone />
      <HowVendoraWorks />
      <FeaturesSection />
      <Footer />
    </div>
  )
}