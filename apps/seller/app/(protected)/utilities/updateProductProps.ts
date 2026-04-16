"use server";

import { Product, Variant } from "@vendora/db/frontend";
import { revalidatePath } from "next/cache";

export async function  updateProductProps(
  productId: string,
  productData: { price: number, discountedPrice: number },
  variantData: { _id: string, price: number, stock: number }[]
) {
  try {
    await Product.findByIdAndUpdate( productId, {
      price: productData.price,
      discountedPrice: productData.discountedPrice,
      discount: Math.floor(((Number(productData.price) - Number(productData.discountedPrice)) / Number(productData.price)) * 100)
    });

    const bulkUpdate = variantData.map(v => ({
      updateOne: {
        filter: { _id: v._id },
        update: { $set: { price: v.price, stock: v.stock } }
      }
    }));

    await Variant.bulkWrite(bulkUpdate);

    revalidatePath("/products");

    return { success: true };
  } catch (error) {
    console.error("Failed to update product props:", error);
    return { success: false, message:" Internal Server Error"}
  }
}