import { connectDB, Product } from "@vendora/db";


export async function TotalProducts() {
  await connectDB();

  let totalProducts = 0;
  totalProducts = await Product.countDocuments({ status: "live"}).exec();
  return (
    totalProducts
  )
}

export async function PendingProducts() {
  await connectDB();
  let pendingProducts = 0;
  pendingProducts = await Product.countDocuments({ status: "pending"}).exec();
  return (
    pendingProducts
  )
}