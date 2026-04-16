"use server";
import { connectDB, Product } from "@vendora/db/frontend";
import { revalidatePath } from "next/cache";

export async function updateProductStatus(id: string, newStatus: string) {
  await connectDB();
  await Product.findByIdAndUpdate(id, {status: newStatus});

  revalidatePath("/products");

  const response = await fetch(`${process.env.NEXT_PUBLIC_STORE_URL}/api/revalidate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      secret: process.env.REVALIDATION_SECRET,
      tags: [
        `product-${id}`,
        "products",
        "home-data"
      ]
    }),
  })

  const status = await response.json();
  console.log("Store Response:", status);
}