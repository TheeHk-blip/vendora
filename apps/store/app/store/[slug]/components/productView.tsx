"use client";

import ShoppingCart from "@mui/icons-material/ShoppingCart";
import { IProductBase } from "@vendora/ui/src/types/IProductBase";
import { IVariantBase } from "@vendora/ui/src/types/IVariantBase";
import { Button } from "@vendora/ui/src/components/Button";
import { useMemo, useState } from "react";
import { CartItem } from "@/app/types/cartItem";
import { cartStore } from "@/app/cart/cartStore";
import dynamic from "next/dynamic";
import { useCurrency } from "@vendora/ui/src/context/currencyContext";
import { title } from "@vendora/ui/src/primitives";
import React from "react";

interface ProductProps {
  product: IProductBase;
  variants: IVariantBase[];
  options: Record<string, string[]>;
  initialSelections: Record<string, string>;
}

const ProductGallery = dynamic(() => import("@vendora/ui/src/components/ProductGallery").then(mod => mod.ProductGallery), {
  ssr: true,
  loading: () => <div className="aspect-square w-full, bg-gray-100 animate-pulse rounded-lg" />
})

export default React.memo(function ProductView({ product, variants, options, initialSelections}: ProductProps) {
  const {formatPrice} = useCurrency(); 
  const [selections,  setSelections] = useState(initialSelections);

  const activeVariant = useMemo(() => { 
    return variants.find((v) => {
      const atrrs = (v.attributes as Record<string, any>) || {};
      const vColor = Array.isArray(v.color) ? v.color[0] : v.color;   
      return (
        vColor === selections.color &&
        Object.keys(options).every((key) => atrrs[key] === selections[key])      
      );
    });
  }, [selections, variants, options]);

  const handleAdd = () => {      
    if (!activeVariant) return; 
    const item: CartItem = {
      id: product._id,
      variantId: activeVariant?._id!,
      name: product.name!,
      sku: activeVariant?.sku!,
      price: activeVariant?.price!,
      quantity: 1,
      stock: activeVariant?.stock,
      imageUrl: activeVariant?.image
    };
    cartStore.addItem(item);    
  };

  return (
    <div className="flex flex-col w-full py-2" >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-1.5" >
        <ProductGallery images={product.images} />
        <div className="flex flex-col my-2">
          <p className={title({ color: "foreground", size: "sm", className: "text-center"})}>
            {product.name}
          </p>
        
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
          </div>

          <div className="mt-6 flex flex-row justify-between items-center">
            <div>
              <p className="text-2xl font-bold text-green-600">
                {formatPrice((activeVariant?.price ?? product?.discountedPrice) || product.price)}
              </p>
              <div className="flex flex-col">
                <span className="text-xs text-gray-500">SKU: {activeVariant?.sku || "N/A"}</span>
                <span className={`text-xs font-bold ${activeVariant?.stock! > 5 ? 'text-blue-500' : 'text-orange-500'}`}>
                  {activeVariant 
                    ? (activeVariant.stock! > 0 ? `${activeVariant.stock} in stock` : "Out of Stock")
                    : "Configuration unavailable"
                  }
                </span>
              </div>
            </div>
            <Button
              onClick={handleAdd}
              color={`${activeVariant && activeVariant?.stock!  > 10 ? "success": "warning"}`}
              disabled={!activeVariant || (activeVariant?.stock ?? 0) <= 0}
              className="gap-2"
            >
              {activeVariant?.stock! > 0 ? "Add to Cart" : "Sold Out"}
              <ShoppingCart />
            </Button>
          </div>

          <div className="mt-4" >
            <h2 className={title({ color: "foreground", size: "xs"})}>Features</h2>
            {Object.entries(product.fields || {}).map(([key, value]) => (
              <div key={key}>
                <span className="capitalize font-medium text-gray-600 dark:text-gray-400">{key.replace(/-/g, ' ')}: </span>
                <span>{String(value)}</span>
              </div>
            ))}
          </div>
        </div>        
      </div>

      <div>
        <h2 className={title({ color: "foreground", size: "sm"})}>Description</h2>
        <p className="whitespace-pre-line prose dark:prose-invert">{product.description}</p>
      </div>
    </div>
  )
})