import { connectDB, Category } from "@vendora/db/frontend";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";


export async function POST(request: Request) {
  try {
    await  connectDB();

    const {name, slug, parentId, fields, images} = await request.json();
    const category = {name, slug, fields, images};

    if (!category) {
      return NextResponse.json({error: "All fields are required"},{status: 400});
    }

    const existingCategory = await Category.findOne({ slug }).lean();
    if (!existingCategory) {
      await Category.create({
        name,
        slug,
        images,
        parentId,
        fields
      })
    }

    revalidatePath("/products/category")
    return NextResponse.json({ category }, {status: 201})
  } catch (error) {
    console.error("Category creation error:", error);
    return NextResponse.json({ error: "Experienced an error while creating category. Please try again later." }, { status: 400 })
  }
}

export async function GET() {
  try {
    await connectDB()
    const publishedCategory = await Category.find({}).lean();

    if (!publishedCategory || publishedCategory.length === 0) return NextResponse.json({error:"No category found"}, {status: 404})
    return NextResponse.json({publishedCategory}, {status: 200})
  } catch (error) {
    console.error("Fetch erro:", error)
    return NextResponse.json({error: "Internal server error"}, {status: 404})
  }
}