import { authOptions } from "@vendora/auth";
import { connectDB } from "@vendora/db";
import User from "@vendora/db/src/models/users";
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
    await User.findOneAndUpdate({ email: session.user.email }, { role }, { new: true });

    // clear the cookie
    const response = NextResponse.json({ ok: true, message: "User role updated successfully" });
    response.headers.append("Set-Cookie", `vendora_role=; Path=/; Max-Age=0; SameSite=Lax`);
    return response;
  } catch (error) {
    console.error("Error updating user role:", error);
    return NextResponse.json({ ok: false, message: "Internal Server Error" }, { status: 500 });
  }
}