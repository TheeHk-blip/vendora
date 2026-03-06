"use client";

import { cartStore } from "@/app/cart/cartStore";
import { CartItem } from "@/app/types/cartItem";
import ShoppingCart from "@mui/icons-material/ShoppingCart";
import { SerializeData } from "@vendora/ui";
import { Button } from "@vendora/ui/src/components/Button";
import PriceDisplay from "@vendora/ui/src/components/priceDisplay";
import { IProductBase } from "@vendora/ui/src/types/IProductBase";
import { IVariantBase } from "@vendora/ui/src/types/IVariantBase";
import { useMemo, useState } from "react";

interface VariantProps {
  initialSelections: Record<string, string>;
  variants: IVariantBase[];
  product: IProductBase;
  options: Record<string, string[]>;
  sellerInfo: {
    _id: string,
    businessName: string,
    rating: number
  };
}

export function VariantSelection({ initialSelections, options, variants, product, sellerInfo}: VariantProps) {
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
          <div className="flex gap-1 sm:gap-2 mb-1" >
            {(values as string[]).map((val) => (
              <Button
                key={val}
                onClick={() => setSelections(prev => ({...prev, [attrName]: val}))}
                className={`px-2 py-1 rounded-xl transition-all ${
                  selections[attrName] === val 
                    ? "ring text-green-500 bg-transparent" 
                    : "bg-black/30 dark:bg-white/20"
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
          <p className="text-2xl font-bold text-green-600">
            <PriceDisplay amount={((activeVariant?.price ?? product?.discountedPrice) || product.price)} />
          </p>
          <div className="flex flex-col">
            <span className="text-xs text-gray-500">SKU: {activeVariant?.sku || "N/A"}</span>
            <span className={`text-xs font-bold ${activeVariant?.stock ?? 0 > 5 ? 'text-blue-500' : 'text-orange-500'}`}>
              {activeVariant 
                ? (activeVariant.stock! > 0 ? `${activeVariant.stock} in stock` : "Out of Stock")
                : "Configuration unavailable"
              }
            </span>
            <span>Merchant: {sellerInfo.businessName}</span>
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
    </div>
  )
}
