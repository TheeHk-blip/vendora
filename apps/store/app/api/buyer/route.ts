import { Buyer, connectDB } from "@vendora/db/frontend";
import { connection, NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  await connection();
  await connectDB();
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Missing user ID" }, { status: 400 });
  }

  const data = await Buyer.findOne({userId: id})
    .populate({
      path: "userId",
      model: "User",
      select: "name"   
    })
    .lean();

  return NextResponse.json(data)
}