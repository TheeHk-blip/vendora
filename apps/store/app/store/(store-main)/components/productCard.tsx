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
    lg: "35vw",
    md: "50vw",
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
          <div className="flex flex-col justify-start" >            
            <span className="text-gray-600 dark:text-gray-400 text-xs line-clamp-1 leading-tight justify-self-start">{product.name}</span>                                                
            <span className="flex flex-col" suppressHydrationWarning>           
              {product.discount && product.discount > 0
                ? <PriceDisplay amount={product.discountedPrice!} />
                : <PriceDisplay amount={product.price} />
              }          
              {!!product.discount && product.discount > 0 && (                              
                <PriceDisplay amount={product.price} className="line-through text-[10px] md:text-xs text-gray-500" />                                             
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
            className=" object-contain shadow-md"
            fetchPriority="high"          
          />     
          <div className="flex items-center">
            {!!product.discount && product.discount > 0 && (
              <span className="text-[9px] absolute top-0 right-0 sm:text-xs font-medium text-orange-500 bg-orange-50 dark:bg-orange-900/30 px-1 py-0.5 " >
                - {product.discount}%
              </span>
            )}     
          </div>  
        </div>                          
      </Card>    
    </Link>
  )
}