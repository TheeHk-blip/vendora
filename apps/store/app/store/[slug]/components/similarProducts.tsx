import { Card, getTailwindSizes, title } from "@vendora/ui";
import PriceDisplay from "@vendora/ui/src/components/priceDisplay";
import { IProductBase } from "@vendora/ui/src/types/IProductBase";
import Image from "next/image";
import Link from "next/link";

export function SimilarProducts({product}: {product: IProductBase[]}) {
  const sizes = getTailwindSizes({
    xl: "25vw",
    lg: "33vw",
    md: "50vw",
    sm: "50vw",
    default: "100vw"
  });
  return(
    <div className="flex flex-col w-full px-2">
      <span className={title({ size: "xs"})} >Similar Products</span>
      <div className="flex flex-row md:grid md:grid-cols-4 overflow-x-auto gap-2.5 pb-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        {product.map((item) => (
          <Link
            key={item._id}
            href={`/store/${item._id}`}
            className="hover:shadow-md rounded-xl w-40 md:w-full active:scale-[0.98]" 
          >
            <Card
              key={item._id}
              variant="product"
              footer={
                <div className="flex flex-col min-w-0">
                  <span className="truncate text-sm whitespace-nowrap overflow-hidden">{item.name}</span>
                  <PriceDisplay amount={item.price} className="text-black/80 dark:text-white/80" />
                </div>              
              }
            >
              <div className="relative aspect-square">
                <Image 
                  alt={`${item.name} image`}
                  src={item.images[0]}
                  fill
                  sizes={sizes}             
                  fetchPriority="auto"
                  loading="lazy"
                  className="object-contain shadow-md"
                />
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}

export function SimilarProductsSkeleton() {
  return(
    <div className="flex flex-col">
      <span className={title({ size: "xs"})} >Similar Products</span>
      <div className="flex flex-row gap-2.5">
        <Card variant="product" >
          <div className="w-25 h-25" ></div>
        </Card>
      </div>
    </div>
  )
}