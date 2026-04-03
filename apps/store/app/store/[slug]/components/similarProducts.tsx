import { Card, title } from "@vendora/ui";
import PriceDisplay from "@vendora/ui/src/components/priceDisplay";
import { IProductBase } from "@vendora/ui/src/types/IProductBase";
import Image from "next/image";
import Link from "next/link";

export function SimilarProducts({product}: {product: IProductBase[]}) {
  return(
    <div className="flex flex-col">
      <span className={title({ size: "xs"})} >Similar Products</span>
      <div className="flex flex-row gap-2.5">
        {product.map((item) => (
          <Link
            key={item._id}
            href={`/store/${item._id}`}
          >
            <Card
              key={item._id}
              variant="product"
              footer={
                <div className="flex flex-col">
                  <span>{item.name}</span>
                  <PriceDisplay amount={item.price} className="text-gray-600 dark:text-gray-400" />
                </div>              
              }
            >
              <Image 
                alt={`${item.name} image`}
                src={item.images[0]}
                width={100}
                height={100}
                style={{ width: "auto", height: "auto"}}
                fetchPriority="auto"
                loading="lazy"
                className="object-contain"
              />
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}