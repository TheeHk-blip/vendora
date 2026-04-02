import { Category, connectDB } from "@vendora/db";
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Category update error:", error);
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}