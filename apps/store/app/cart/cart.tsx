"use client";

import ShoppingCart from "@mui/icons-material/ShoppingCart";
import { cartStore, useCart } from "./cartStore";
import Image from "next/image";
import Link from "next/link";
import { useDrawer } from "@vendora/ui/src/context/drawerContext";
import { SideNav } from "@vendora/ui/src/components/sidenav";
import { Button } from "@vendora/ui/src/components/Button";
import Remove from "@mui/icons-material/Remove";
import Add from "@mui/icons-material/Add";
import PriceDisplay from "@vendora/ui/src/components/priceDisplay";
import CreditCard from "@mui/icons-material/CreditCard";

export default function Cart() {
  const { openDrawer, closeDrawer } = useDrawer()
  const items = useCart();

  const totalItems = items.reduce((total, item) => total + item.quantity, 0);
  const handleRemove = (variantId: string) => {          
    cartStore.removeItem(variantId);
  };
  const subTotal = items.reduce(
    (acc, item) => acc + item.price * item.quantity, 0    
  )

  return (
    <div className="relative">
      <ShoppingCart 
        onClick={() => openDrawer("cart")}
        className="cursor-pointer text-neutral-600 dark:text-neutral-400"
      />
      {totalItems > 0 && (
        <span className="absolute bottom-4 right-0 bg-white/20 rounded-xl font-semibold text-xs px-1" >{totalItems}</span>
      )}
      <SideNav
        id="cart"
        title={<span className="text-gray-600 dark:text-gray-300">Cart</span>}
        closeButton={
          <button
            type="button"
            onClick={() => closeDrawer()}   
            className="px-2"      
          >
            X
          </button>
        }
        body={
          <div className="gap-2 flex flex-col">
            {items.map((cartItem) => {                                 
              return (     
              <div 
                key={cartItem.variantId}
                className="bg-black/15 dark:bg-white/25 px-1.5 py-1 gap-1 flex flex-col rounded-md"
              >
                <div className="flex flex-col gap-2">
                  <div className="flex flex-row justify-between">
                    <span className="text-gray-700 dark:text-gray-300">{cartItem.name}</span>
                    <button
                      onClick={() => handleRemove(cartItem.variantId)}
                      className="px-2 cursor-pointer hover:bg-background rounded-xl"
                    >
                      X
                    </button>
                  </div>
                  <span className="text-sm" >SKU: {cartItem.sku}</span>
                </div>
                
                <div className="flex flex-row justify-between">
                  <Image 
                    alt={`${cartItem.name} image`}
                    src={cartItem.imageUrl!}
                    width={100}
                    height={100}
                    className="rounded-lg"
                  />
                  <div className="flex flex-col justify-between gap-1">
                    <div className="flex flex-row items-center gap-3">
                      <Button
                        onClick={() => cartStore.updateQuantity(cartItem.variantId, cartItem.quantity - 1)}
                        className="text-red-500"
                      >
                        <Remove />
                      </Button>
                      <span className="text-xs" >{cartItem.quantity}</span>
                      <Button
                        disabled={cartItem.quantity >= cartItem.stock!}
                        onClick={() => cartStore.updateQuantity(cartItem.variantId, cartItem.quantity + 1, cartItem.stock)}
                        className="text-green-500"
                      >
                        <Add />
                      </Button>
                    </div>                                                              
                    <PriceDisplay amount={(cartItem.price * cartItem.quantity)} />
                  </div>                  
                </div>
              </div>
              )
            })}
          </div>          
        }
        actions={
          <>
            {items.length > 0 ? (
              <div className="flex flex-col gap-2" >
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-300" >Subtotal:</span>
                  <span className="text-gray-600 dark:text-gray-300 font-medium" >
                    <PriceDisplay amount={subTotal} />
                  </span>
                </div>
                <Link 
                  href={"/store/checkout"}
                  className="flex gap-2 bg-green-600 hover:ring rounded-lg px-2 py-1"
                >
                  Checkout
                  <CreditCard />                  
                </Link>
              </div>
            ): (
              <div className="p-8 text-center text-gray-500">
                Your cart is empty
              </div>
            )}
          </>
        }
      />
    </div>
  )
}