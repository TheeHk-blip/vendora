import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";


export async function POST(req: Request) {
  try {
    const {tags, secret} = await req.json()

    if (secret !== process.env.REVALIDATION_SECRET) {
      return NextResponse.json({ message: "unauthorized" }, { status: 401 });
    }
    
    if (Array.isArray(tags)) {
      tags.forEach((tag) => {
        revalidateTag(tag, "hours")
      })
    } else {
      revalidateTag(tags, "hours")
    }
    return NextResponse.json({ revalidated: true })    
  } catch (error) {
    return NextResponse.json({ "Failed to revalidate": error }, { status: 500 });
  }
}