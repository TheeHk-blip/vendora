import { Card, getTailwindSizes, title } from "@vendora/ui";
import PriceDisplay from "@vendora/ui/src/components/priceDisplay";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getHomeData } from "./storeData";

export const metadata:Metadata = ({
  title: "Store | Vendora",
  description: "Your one stop shop for all your needs, from kitchen to electronics, tools and even mobile devices we've got you covered."
})

export default async function Home() {
  const { categories, exclusiveOffers, latestProducts } = await getHomeData();
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
        <div className="flex flex-row gap-2.5 overflow-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden py-2 px-1.5">
          {categories.map((category, index: number) => (
            <div key={category.slug} className="gap-2.5">            
              <Link href={`/store?categoryId=${category._id}`}>
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
                      fetchPriority={index < 2 ? "high" : "auto"}      
                      loading={index < 2 ? "eager" : "lazy"}             
                    />
                  </div>
                </Card>
              </Link>              
            </div>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-10 max-w-full items-center">
        <div className="flex flex-col">
          <span className={title({className: "text-center"})}>Exclusive Offers</span>     
          <div className="flex flex-row gap-2.5 overflow-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden py-2 px-1.5">
            {exclusiveOffers.map((product, index: number) => (
              <div key={product._id.toString()} className="gap-2.5">            
                <Link href={`/store/${product._id}`}>
                  <Card
                    key={product._id.toString()}
                    header={                                        
                      <span>{product.name}</span>                                 
                    }
                    footer={
                      <div className="flex flex-col justify-between">
                        <span className="text-xs text-gray-600 dark:text-gray-400" >Was <PriceDisplay amount={product.price} className="line-through"/></span>
                        <span className="flex flex-col">
                          <span className="text-orange-600 dark:text-orange-500" >{product.discount}% OFF</span>
                          <span>Now <PriceDisplay amount={product.discountedPrice ?? 0} /></span>
                        </span>
                      </div>
                    }
                  >
                    <div className="relative aspect-square w-37.5">
                      <Image 
                        alt={`${product.name} image`}
                        src={product.images[0]}
                        fill
                        sizes={sizes}
                        className="rounded-xl object-contain"
                        fetchPriority={index < 2 ? "high" : "auto"}      
                        loading={index < 2 ? "eager" : "lazy"}   
                      />
                    </div>
                  </Card>
                </Link>              
              </div>
            ))}
          </div>                 
        </div>
        <div className="flex flex-col" >
          <span className={title({className: "text-center"})}>New Arrivals</span> 
          <div className="flex flex-row gap-2.5 overflow-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden py-2 px-1.5">
            {latestProducts.map((product, index: number) => (
              <div key={product._id.toString()} className="gap-2.5">            
                <Link href={`/store/${product._id}`}>
                  <Card
                    key={product._id.toString()}
                    header={                                        
                      <span>{product.name}</span>                                 
                    }
                    footer={
                      <div className="flex flex-col justify-between">
                        <span className="text-xs text-gray-600 dark:text-gray-300" >Was <PriceDisplay amount={product.price} className="line-through" /></span>
                        <span className="flex flex-col">
                          <span className="text-orange-500" >{product.discount}% OFF</span>
                          <span>Now <PriceDisplay amount={product.discountedPrice ?? 0} /></span>
                        </span>
                      </div>
                    }
                  >
                    <div className="relative aspect-square w-37.5">
                      <Image 
                        alt={`${product.name} image`}
                        src={product.images[0]}
                        fill
                        sizes={sizes}
                        className="rounded-xl object-contain"
                        fetchPriority={index < 2 ? "high" : "auto"}      
                        loading={index < 2 ? "eager" : "lazy"}   
                      />
                    </div>
                  </Card>
                </Link>              
              </div>
            ))}
          </div> 
        </div>
      </div>
    </div>
  )
}
