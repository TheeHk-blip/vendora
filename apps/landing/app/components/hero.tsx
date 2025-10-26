"use client";

import { title } from "@vendora/ui";
import Link from "next/link";

export default function Hero() {

  return (
    <div className="flex flex-col items-center justify-center">     
      <h1 className={title({ color: "foreground", size: "lg", })}>Modern Commerce, <span className={title({ color: "blue", size: "lg"})}>Simplified</span></h1> 
      <span className="mt-4 text-center text-gray-600 dark:text-gray-300 max-w-3xl">
        Empower your business with Vendora's all-in-one platform. Seamlessly manage products, orders, and customers while delivering exceptional shopping experiences.
      </span>     
      <div className="flex justify-center gap-5 my-8 w-full max-w-4xl px-4">
        <Link 
          href={"/onboarding"}
          className="bg-blue-600 hover:bg-blue-700 text-white text-base px-6 py-3 rounded-2xl transition-colors duration-300"
        >
          Get Started
        </Link>
        <button        
          onClick={() => {
            document.getElementById("features")?.scrollIntoView({behavior: "smooth"});
          }}
          className="px-6 py-3 rounded-full text-gray-800 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 hover:dark:bg-gray-800 dark:text-gray-100 cursor-pointer transition-colors duration-300"
        >
          Explore Features
        </button>
      </div>
    </div>
  )
}