import { title } from "@vendora/ui";
import { Metadata } from "next";

export const metadata:Metadata = ({
  title: "Store | Vendora",
  description: "Your one stop shop for all your needs, from kitchen to electronics, tools and even mobile devices we've got you covered."
})

export default function Home() {
  return (
    <div className="flex flex-col justify-center px-2 py-2 w-full max-w-7xl" >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-full items-center">
        <div>
          <span className={title()}>Exclusive Offers</span>                      
        </div>
        <div>
          <span className={title()}>New Arrivals</span> 
        </div>
      </div>
    </div>
  )
}
