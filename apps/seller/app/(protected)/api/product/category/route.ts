import { connectDB, Category } from "@vendora/db/frontend";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const {searchParams} = new URL(request.url);
  const parentId = searchParams.get("parentId");

  try {
    await connectDB()
    let query = {};

    if (parentId === "null") {
      query = {parentId: null};      
    } else if (parentId) {
      query = {parentId: parentId}
    }

    const categories = await Category.find(
      query,
      "name _id fields"
    ).lean();
    
    return NextResponse.json({categories}, {status: 200} );
  } catch (error) {
    console.error({message:"Error retrieving documents:", error})
    return NextResponse.json({error:"Failed to fetch categories"}, {status: 400})
  }
}