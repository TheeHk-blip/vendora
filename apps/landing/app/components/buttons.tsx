"use client";

export function FeatureButton() {
  return (
    <button        
      onClick={() => {
        document.getElementById("features")?.scrollIntoView({behavior: "smooth"});
      }}
      className="px-6 py-3 rounded-full text-gray-800 bg-gray-200 active:scale-99 hover:bg-gray-300 dark:bg-gray-700 hover:dark:bg-gray-800 dark:text-gray-100 cursor-pointer transition-all duration-300"
    >
      Explore Features
    </button>
  )
}