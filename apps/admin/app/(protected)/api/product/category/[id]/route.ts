import { Category, connectDB } from "@vendora/db/frontend";
import { NextResponse } from "next/server";

type Params = Promise<{ id: string }>;

export async function PATCH(req: Request, {params}: {params: Params}) {
  try {
    const id = (await params).id;
    const { name, slug, fields, images, parentId } = await req.json();

    await connectDB();

    const updatedCategory = await Category.findByIdAndUpdate(id, {
      $set: {
        name,
        slug,
        fields,
        images,
        parentId,
      }
    });

    return NextResponse.json({updatedCategory}, {status: 201});  
  } catch (error) {
    console.error("Category update error:", error);
    return NextResponse.json({ error: "Category update failed" }, { status: 400 })
  }
}