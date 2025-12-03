"use client";

import { SideNav, useDrawer } from "@vendora/ui";
import ShoppingCart from "@mui/icons-material/ShoppingCart";

export default function Cart() {
  const { openDrawer, closeDrawer } = useDrawer()

  return (
    <>
      <ShoppingCart 
        onClick={() => openDrawer("cart")}
        className="cursor-pointer text-neutral-600 dark:text-neutral-400"
      />
      <SideNav
        id="cart"
        title={<span className="text-gray-600 dark:text-gray-300">Cart</span>}
        closeButton={
          <button
            onClick={() => closeDrawer()}         
          >
            X
          </button>
        }
      />
    </>
  )
}