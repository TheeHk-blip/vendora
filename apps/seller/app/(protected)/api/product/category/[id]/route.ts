import { connectDB, Category } from "@vendora/db";
import { NextResponse } from "next/server";


export async function GET(
  {params}: {params: Promise<{id: string}>}
) {
  try {
    await connectDB();

    const {id} = await params;
    const category = await Category.findOne({
      $or: [
        {slug: id},
        {name: id}
      ]
    }).lean();

    if (!category) {      
      return NextResponse.json({ error: "Category not found"}, {status: 404})      
    }

    return NextResponse.json(category, { status: 200 });
  } catch (error) {
    console.error("Category not found:", error)
    return NextResponse.json({ error: "Invalid ID format"}, {status: 400})
  }
}