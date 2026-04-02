import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (
    pathname === "/unauthorized" || 
    pathname.startsWith("/verify-email") 
  ) {
    return NextResponse.next();
  }

  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET
  });

  if (!token) {
    return NextResponse.redirect(new URL(`${process.env.NEXT_PUBLIC_BASE_URL}/signin`, request.url))
  }

  if (token.role !== "seller") {
    const url = request.nextUrl.clone()
    url.pathname = "/unauthorized"
    return NextResponse.redirect(url)
  }

  if (token.isVerified !== true) {
    const userEmail = token.email || "";

    const verifyUrl = new URL("/verify-email", request.url);
    if (userEmail) {
      verifyUrl.searchParams.set("email", userEmail);
      return NextResponse.redirect(verifyUrl);
    }    
    
    return NextResponse.redirect(new URL(`${process.env.NEXT_PUBLIC_BASE_URL}/`))
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
    "/"
  ]
}
