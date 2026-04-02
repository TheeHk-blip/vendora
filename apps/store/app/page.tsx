import { Category, ICategory } from "@vendora/db";
import { Card, getTailwindSizes, title } from "@vendora/ui";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata:Metadata = ({
  title: "Store | Vendora",
  description: "Your one stop shop for all your needs, from kitchen to electronics, tools and even mobile devices we've got you covered."
})

export default async function Home() {
  const categories = await Category.find();
  const sizes = getTailwindSizes({
    xl: "25vw",
    lg: "35vw",
    md: "50vw",
    default: "100vw"
  });
  return (
    <div className="flex flex-col justify-center px-2 py-2 gap-4 w-full max-w-7xl" >
      <div className="flex flex-col gap-2.5">
        <h1 className={title({ className: "text-center"})}>Shop By Category</h1>
        <div className="flex flex-row gap-2.5 overflow-x-scroll py-2 px-1.5">
          {categories.map((category: ICategory) => (
            <div key={category.slug} className="gap-2.5">            
              <Link href={`/store?categoryId=${category.id}`}>
                <Card
                  key={category.slug}
                  header={
                    <span>{category.name}</span>
                  }
                >
                  <div className="relative aspect-square w-37.5">
                    <Image 
                      alt={`${category.name} image`}
                      src={category.images[0]}
                      fill
                      sizes={sizes}
                      className="rounded-xl object-contain"
                      fetchPriority="high"
                    />
                  </div>
                </Card>
              </Link>              
            </div>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-full items-center">
        <div className="flex flex-col">
          <span className={title({className: "text-center"})}>Exclusive Offers</span>                      
        </div>
        <div className="flex flex-col" >
          <span className={title({className: "text-center"})}>New Arrivals</span> 
        </div>
      </div>
    </div>
  )
}
