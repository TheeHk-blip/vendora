import { title } from "@vendora/ui/src/primitives";
import Link from "next/link";
import { FeatureButton } from "./buttons";

export default function Hero() {

  return (
    <div className="flex flex-col items-center justify-center">     
      <h1 className={title({ color: "foreground", size: "lg"})}>Modern Commerce, &#8203;<span className={title({ color: "blue", size: "lg"})}>Simplified</span></h1>
      <span className="mt-4 text-start text-gray-600 dark:text-gray-300 max-w-3xl">
        Empower your business with Vendora&apos;s all-in-one platform. Seamlessly manage products, orders, and customers while delivering exceptional shopping experiences.
      </span>     
      <div className="flex justify-center gap-5 my-8 w-full max-w-4xl px-4">
        <Link 
          href={"/onboarding"}
          className="bg-blue-600 hover:bg-blue-700 active:scale-99 text-white text-base px-6 py-3 rounded-2xl transition-all duration-300"
        >
          Get Started
        </Link>
        <FeatureButton />
      </div>
    </div>
  )
}