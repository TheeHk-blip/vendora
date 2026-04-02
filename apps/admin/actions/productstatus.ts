"use server";
import { connectDB, Product } from "@vendora/db";
import { revalidatePath } from "next/cache";

export async function updateProductStatus(id: string, newStatus: string) {
  await connectDB();
  await Product.findByIdAndUpdate(id, {status: newStatus});

  revalidatePath("/products");
}