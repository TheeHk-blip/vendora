import { Card } from "@vendora/ui/src/components/Card";
import { getTailwindSizes } from "@vendora/ui/src/utilities/image-helper";
import Image from "next/image";
import Link from "next/link";
import { IProductBase } from "@vendora/ui/src/types/IProductBase";
import PriceDisplay from "@vendora/ui/src/components/priceDisplay";


interface ProductProps {  
  product: IProductBase;
  index : number;
}

export default function ProductCard({ product, index} : ProductProps) {
  const sizes = getTailwindSizes({
    xl: "25vw",
    lg: "33vw",
    md: "50vw",
    sm: "50vw",
    default: "100vw"
  });
  const urlName = product.name?.toLowerCase().replace(/ /g, "-");

  return (  
    <Link
      href={`/store/${product._id}-${urlName}`}         
      className="hover:shadow-md rounded-xl h-fit active:scale-[0.98]"      
    >
      <Card 
        variant="product"
        key={index} 
        footer={                    
          <div className="flex flex-col justify-start min-w-0" >                                  
            <div className="flex justify-between items-center">       
               <span className="text-black/80 dark:text-white/80 text-xs truncate whitespace-nowrap overflow-hidden">{product.name}</span> 
                <div className="flex shrink-0">
                  {!!product.discount && product.discount > 0 && (
                    <span className="text-xs font-medium bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-400 px-1 rounded" >
                      - {product.discount}%
                    </span>
                  )}     
                </div>  
            </div> 
            <span className="flex flex-col pb-1" suppressHydrationWarning>                                 
              {product.discount && product.discount > 0
                ? <PriceDisplay amount={product.discountedPrice ?? 0} />
                : <PriceDisplay amount={product.price} />
              }  
              {!!product.discount && product.discount > 0 && (                              
                <PriceDisplay amount={product.price} className="line-through text-xs text-black/60 dark:text-white/60" />                                             
              )}                                     
            </span>                
          </div>                                   
        }                    
      >          
        <div className="relative aspect-square">     
          <Image 
            alt={`${product.name} image`}
            src={product.images[0]}
            fill
            sizes={sizes}                    
            className=" object-contain rounded-t-md"     
            fetchPriority="auto"                 
            loading="eager"
          />               
        </div>                          
      </Card>    
    </Link>
  )
}