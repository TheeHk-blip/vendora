import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET
  })

  if (pathname === "/unauthorized") {
    return NextResponse.next();
  }  

  if (!token) {
    return NextResponse.redirect(new URL(`${process.env.NEXT_PUBLIC_BASE_URL}/signin`))
  }

  if (token.role !== "admin")
    return NextResponse.redirect(new URL("/unauthorized", request.url))
}

export const config = {
  matcher: "/((?!api|_next/static|_next/image|favicon.ico).*)"
}
