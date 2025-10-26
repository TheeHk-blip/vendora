import BuiltForEveryone from "../components/builtforall";
import FeaturesSection from "../components/features";
import Footer from "../components/footer";
import Hero from "../components/hero";
import HowVendoraWorks from "../components/howvendoraworks";


export default function Home() {
  return (
    <div className="flex flex-col justify-center py-2 px-2 w-full max-w-7xl mx-auto">
      <Hero />
      <BuiltForEveryone />
      <HowVendoraWorks />
      <FeaturesSection />
      <Footer />
    </div>
  )
}