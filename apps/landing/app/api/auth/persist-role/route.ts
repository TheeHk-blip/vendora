import { authOptions } from "@vendora/auth";
import { connectDB } from "@vendora/db";
import Buyer from "@vendora/db/src/models/buyer";
import Seller from "@vendora/db/src/models/seller";
import User from "@vendora/db/src/models/user";
import { parse as parseCookie } from "cookie";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const cookieHeader = request.headers.get("cookie") || "";
    const cookies = parseCookie(cookieHeader);
    const role = cookies.vendora_role;

    if (!role) return NextResponse.json({ ok: false, message: "No role cookie found" }, { status: 400 });

    // get session for authenticated user
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) return NextResponse.json({ ok: false, message: "No authenticated user" }, { status: 401 });

    await connectDB();
    const dbUser = await User.findOneAndUpdate(
      { email: session.user.email },
      { role },
      { new: true }
    );

    if (!dbUser)
      return NextResponse.json({ ok: false, message: "User not found in DB" }, { status: 404 });

    if (role === "seller") {
      const existingSeller = await Seller.findOne({ userId: dbUser._id });
      if (!existingSeller) {
        await Seller.create({
          userId: dbUser._id,
          businessName: dbUser.name || "unnamed Store"
        })
      }
    }

    if (role === "buyer") {
      const existingBuyer = await Buyer.findOne({ userId: dbUser._id });
      if (!existingBuyer) {
        await Buyer.create({
          userId: dbUser._id
        })
      }
    }
    
    const response = NextResponse.json({ 
      ok: true, 
      message: "User role and role document created successfully" 
    });

    // clear the cookie
    response.headers.append(
      "Set-Cookie",
      `vendora_role=; Path=/; Max-Age=0; SameSite=Lax`
    );

    return response;
  } catch (error) {
    console.error("Error updating user role:", error);
    return NextResponse.json(
      { ok: false, message: "Internal Server Error" }, 
      { status: 500 }
    );
  }
}