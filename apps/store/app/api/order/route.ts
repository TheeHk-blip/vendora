import { connectDB, Order } from "@vendora/db/frontend"
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get("orderId");

    if (!orderId) {
      return NextResponse.json({ error: "Order ID is required" }, { status: 400 })
    }

    await connectDB()
    const existingOrder = await Order.findById(orderId).select({ paymentMethod: 1 })    
    
    return NextResponse.json({ existingOrder })
  } catch (error) {
    console.error("Order not found:", error);
    return NextResponse.json({ error: "Order not found"}, { status: 500 })
  }
}