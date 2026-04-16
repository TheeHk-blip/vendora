import { IProduct, IVariant, Variant } from "@vendora/db/frontend";
import PriceDisplay from "@vendora/ui/src/components/priceDisplay";
import { STATUS_COLORS } from "@vendora/ui/src/utilities/statusColor";
import Image from "next/image";
import { EditScreen } from "./editscreen";
import { SerializeData } from "@vendora/ui";

export async function ProductCard({products}: {products: IProduct[]}) {
  const productIds = products.map(p => p._id);
  const variants = await Variant.find({ productId: { $in: productIds }}).lean();

  const serializedVariants = SerializeData(variants);
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 w-full gap-2.5">
      {products.map((product, index) => {
        const productVariants = serializedVariants.filter(
          (v: IVariant) => v.productId.toString() === product._id.toString()
        )
        return (
          <div 
            key={product._id.toString()}     
            className="flex flex-col justify-between rounded-xl bg-black/15 dark:bg-white/15 w-fit"     
          >  
            <div className="flex flex-col gap-1.5">      
              <Image 
                alt="Product images"
                src={product.images[0]}
                width={150}
                height={150}
                className="shadow-sm"
                fetchPriority={index < 3 ? "high" : "auto"}      
                loading={index < 3 ? "eager" : "lazy"}   
                style={{ width: "auto", height: "auto"}}
              />    
              <div className="flex flex-col px-1">
                <span className="text-gray-600 dark:text-gray-300 text-medium" >{product.name}</span>           
                <PriceDisplay 
                  amount={product.price}
                  className="text-sm"
                />   
              </div>
            </div>              
            <div className="flex flex-row justify-between px-1 py-1.5 items-center w-full">
              <div className="flex flex-row items-center gap-1" >
                <span>Status:</span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  STATUS_COLORS[product.status ?? ""] || "bg-gray-500/20 text-gray-600"
                  }`}
                >
                  {product.status}
                </span>
              </div>
              <EditScreen 
                key={product._id.toString()} 
                product={SerializeData(product)} 
                variants={productVariants}
              />
            </div>
          </div>     
        );     
      })}        
    </div>      
  )
}