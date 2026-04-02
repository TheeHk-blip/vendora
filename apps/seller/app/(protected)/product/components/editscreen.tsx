"use client";

import { Close } from "@mui/icons-material";
import { IProduct } from "@vendora/db";
import { Button, InputField, SideNav, useDrawer, useToast } from "@vendora/ui"
import Image from "next/image";
import { useState } from "react";
import { updateProductProps } from "../../utilities/updateProductProps";

interface ProductEditProps {
  product: IProduct,
  variants: {
    _id: string,
    sku: string,
    price: number,
    stock: number,
    image: string[]
  }[]
}

export function EditScreen({ product, variants }: ProductEditProps) {
  const { showToast } = useToast();
  const { openDrawer, closeDrawer } = useDrawer();
  const drawerId = `edit-product-${product._id}`;
  const [localProduct, setLocalProduct] = useState({
    price: product.price,
    discountedPrice: product.discountedPrice ?? 0
  });
  const [localVariants, setLocalVariants] = useState(variants);
  const [isPending, setIsPending] = useState(false);

  const handleProductChange = (field: "price" | "discountedPrice", value: string) => {
    setLocalProduct(prev => ({ ...prev, [field]: Number(value)}));
  }

  const handleChange = (id: string, field: "price" | "stock", value: string) => {
    setLocalVariants(prev => prev.map(v =>
      v._id === id ? { ...v, [field]: Number(value) }: v
    ));
  };

  const handleSave = async () => {
    setIsPending(true);

    const payload = localVariants.map(v => ({  
      ...v,
      _id: v._id.toString()
    }));

    const result = await updateProductProps(product._id.toString(), localProduct, payload);
    if (result.success) {
      closeDrawer()
      showToast("Product edited successfully", "success")
    } else {
      showToast("Failed to update product", "error")
    }
    setIsPending(false);
  }

  return (
    <>
      <span 
        onClick={() => openDrawer(drawerId)}
        className="px-1 bg-foreground/30 rounded-md cursor-pointer"
      >
        Edit
      </span>
      <SideNav 
        id={drawerId}
        className="w-75 sm:w-150"
        closeButton={
          <button
            onClick={() => closeDrawer()}
          >
            <Close />
          </button>
        }
        body={                                 
          <div className="flex flex-col">
            <span className="text-gray-600 dark:text-gray-400" >{product.name}</span>
            <div className="flex flex-row ml-2.5 gap-2.5 my-2.5" >
              <InputField 
                label="Price"
                defaultValue={localProduct.price}
                onChange={(e) => handleProductChange("price", e.target.value)}
              />
              <InputField 
                label="Discounted Price"
                defaultValue={localProduct.discountedPrice}
                onChange={(e) => handleProductChange("discountedPrice", e.target.value)}
              />
            </div>            
            <div className="flex flex-col gap-2.5" >
              {variants.map(variant => (
                <div key={variant.sku} className="flex flex-col gap-4 mx-2 px-3 py-2 rounded-xl bg-foreground/25 ">
                  <span className="text-sm">{variant.sku}</span>
                  <div className="flex flex-row gap-3">                    
                    <Image 
                      alt="Variant Image"
                      src={variant.image[0]}
                      width={100}
                      height={100}                  
                      fetchPriority="high"
                      className="rounded-lg"    
                      style={{ width: "auto", height: "auto"}}                
                    />
                    <div className="flex flex-col justify-evenly gap-2" >
                      <InputField 
                        label="Stock"
                        defaultValue={variant.stock}
                        onChange={(e) => handleChange(variant._id.toString(), "stock", e.target.value)}
                      />
                      <InputField 
                        label="Price"
                        defaultValue={variant.price}
                        onChange={(e) => handleChange(variant._id.toString(), "price", e.target.value)}
                      />
                    </div>
                  </div>                  
                </div>
              ))}
            </div>
          </div>                        
        }
        actions={
          <Button 
            color="success"
            disabled={isPending}
            onClick={handleSave}
          >
            {isPending ? "Saving..." : "Save Changes"}
          </Button>
        }
      />
    </>
  )
}