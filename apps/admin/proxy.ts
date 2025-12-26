import { authOptions } from "@vendora/auth";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const session = await getServerSession(authOptions);

  if (pathname === "/unauthorized") {
    return NextResponse.next();
  }  

  if (!session) {
    return NextResponse.redirect(new URL(`${process.env.NEXT_PUBLIC_BASE_URL}/signin`))
  }

  if (session?.user.role !== "admin")
    return NextResponse.redirect(new URL("/unauthorized", request.url))
}

export const config = {
  matcher: "/((?!api|_next/static|_next/image|favicon.ico).*)"
}
