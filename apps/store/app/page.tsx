import { title } from "@vendora/ui";
import { Metadata } from "next";

export const metadata:Metadata = ({
  title: "Store | Vendora",
  description: "Your one stop shop for all your needs, from kitchen to electronics, tools and even mobile devices we've got you covered."
})

export default function Home() {
  return (
    <div className="flex flex-col mt-10 justify-center" >
      <div className="grid grid-cols-3 gap-10 max-w-full items-center">
        <div>
          <span className={title({ color: "foreground"})}>
            Exclusive Offers
          </span>
        </div>
        <div className="col-span-2">store</div>
      </div>
    </div>
  );
}
