"use client";

import { cartStore } from "@/app/cart/cartStore";
import { CartItem } from "@/app/types/cartItem";
import { StarRate } from "@mui/icons-material";
import ShoppingCart from "@mui/icons-material/ShoppingCart";
import { IReview, SerializeData } from "@vendora/ui";
import { Button } from "@vendora/ui/src/components/Button";
import PriceDisplay from "@vendora/ui/src/components/priceDisplay";
import { IProductBase } from "@vendora/ui/src/types/IProductBase";
import { IVariantBase } from "@vendora/ui/src/types/IVariantBase";
import { useMemo, useState } from "react";
import { ReviewsModal } from "./reviewsmodal";

interface VariantProps {
  initialSelections: Record<string, string>;
  variants: IVariantBase[];
  product: IProductBase;
  options: Record<string, string[]>;
  sellerInfo: {
    _id: string,
    businessName: string,   
    averageRating: number,
    totalReviews: number,
  };
  reviewInfo: IReview[]
}

export function VariantSelection({ initialSelections, options, variants, product, sellerInfo, reviewInfo}: VariantProps) {
  const [selections, setSelections] = useState(initialSelections);
  const activeVariant = useMemo(() => { 
    return variants?.find((v) => {
      const atrrs = (v.attributes as Record<string, string>) || {};
      const vColor = Array.isArray(v.color) ? v.color[0] : v.color;   
      return (
        vColor === selections?.color &&
        Object.keys(options!).every((key) => atrrs[key] === selections?.[key])      
      );
    });
  }, [selections, variants, options]);

  const handleAdd = () => {      
    if (!activeVariant) return; 
    const item: CartItem = {
      id: product?._id,
      variantId: activeVariant?._id,
      sellerInfo: SerializeData(product.sellerId),     
      name: product?.name ?? "",
      sku: activeVariant?.sku ?? "",
      price: activeVariant?.price ?? 0,
      quantity: 1,
      stock: activeVariant?.stock,
      imageUrl: activeVariant?.image?.[0]
    };
    cartStore.addItem(item);       
  };

  return (
    <div className="mt-4">           
      {Object.entries(options).map(([attrName, values]) => (
        <div key={attrName} >                
          <p className="capitalize text-sm text-gray-600 dark:text-gray-400" >{attrName.replace(/-/g, ' ')}</p>
          <div className="flex flex-wrap gap-2 mb-1" >
            {(values as string[]).map((val) => (
              <Button
                key={val}
                onClick={() => setSelections(prev => ({...prev, [attrName]: val}))}
                className={`px-2 py-1 rounded-xl w-fit transition-all duration-300 ${
                  selections[attrName] === val 
                    ? "bg-green-600/25 dark:bg-green-600/15 shadow-sm" 
                    : "bg-black/15 dark:bg-white/15"
                }`}
              >
                {val}
              </Button>
            ))}                
          </div>
        </div>
      ))}         

      <div className="mt-6 flex flex-row justify-between items-center">
        <div>
          <p className="text-2xl font-bold text-green-700 dark:text-green-600">
            <PriceDisplay amount={((activeVariant?.price ?? product?.discountedPrice) || product.price)} />
          </p>
          <div className="flex flex-col">
            <span className="text-xs text-black/70 dark:text-white/70">SKU: {activeVariant?.sku || "N/A"}</span>
            <span className={`font-bold ${activeVariant?.stock ?? 0 > 5 ? 'text-blue-700 dark:text-blue-600' : 'text-orange-700'}`}>
              {activeVariant 
                ? (activeVariant.stock! > 0 ? `${activeVariant.stock} in stock` : "Out of Stock")
                : "Configuration unavailable"
              }
            </span>            
          </div>
        </div>    
        <Button
          onClick={handleAdd}
          color={`${activeVariant && (activeVariant?.stock ?? 0)  > 10 ? "success": "warning"}`}
          disabled={!activeVariant || (activeVariant?.stock ?? 0) <= 0}
          className="gap-2"
        >
          {activeVariant?.stock ?? 0 > 0 ? "Add to Cart" : "Sold Out"}
          <ShoppingCart />
        </Button>         
      </div>  
      <div className="flex flex-col">
        <span className="flex flex-row items-center gap-2" >
          <span className="text-black/70 dark:text-white/70" >Merchant: {sellerInfo.businessName} </span>
          <span className="flex items-center" > {sellerInfo.averageRating} <StarRate className="text-yellow-500 mb-1" sx={{ width: 19, height: 19}} /> 
            <span className="mb-1 ml-2.5">({sellerInfo.totalReviews})</span>
          </span>
        </span>                              
        <span className="flex flex-row items-center gap-2">
          <span className="text-black/70 dark:text-white/70" >Product Rating: </span>
          <span className="flex items-center">{product.averageRating}<StarRate className="text-yellow-500 mb-1" sx={{ width: 20, height: 20}} />  
            <span className="mb-1 ml-2.5">({product.totalReviews})</span>
          </span>
        </span>        
        {reviewInfo && 
          <div>
            <ReviewsModal reviewInfo={reviewInfo} />    
          </div>  
        }         
      </div>
    </div>
  )
}
