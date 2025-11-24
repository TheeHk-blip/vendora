export const dynamic = "force-dynamic";

import { Metadata } from "next";
import BuiltForEveryone from "../components/builtforall";
import FeaturesSection from "../components/features";
import Footer from "../components/footer";
import Hero from "../components/hero";
import HowVendoraWorks from "../components/howvendoraworks";

export const metadata: Metadata = {
  title: "Home | Vendora",
  description: "Welcome to Vendora, the ultimate marketplace solution for buyers and sellers. Discover a wide range of products, connect with trusted sellers, and enjoy a seamless shopping experience all in one place."
}

export default function Home() {
  return(
    <div className="flex flex-col justify-center px-2 py-2 w-full max-w-7xl" >
      <Hero />
      <BuiltForEveryone />
      <HowVendoraWorks />
      <FeaturesSection />
      <Footer />
    </div>
  )
}