import { Buyer, connectDB } from "@vendora/db/frontend";
import { NextRequest, NextResponse } from "next/server";


export async function GET(req: NextRequest) {
  await connectDB();
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  const data = await Buyer.findOne({userId: id})
    .populate({
      path: "userId",
      model: "User",
      select: "name"   
    })
    .lean();

  return NextResponse.json(data)
}