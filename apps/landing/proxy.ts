import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,    
  });

  if (pathname === "/onboarding" || pathname.startsWith("/register")) {
    return NextResponse.next();
  }

  if (!token) {
    return NextResponse.next();
  }

  if (token && !token.role) {
    return NextResponse.redirect(new URL("/onboarding", request.url))
  }

  switch (token.role) {
    case "buyer":
      return NextResponse.redirect(new URL(process.env.NEXT_PUBLIC_STORE_URL!, request.url));
    case "seller":
      return NextResponse.redirect(new URL(process.env.NEXT_PUBLIC_SELLER_URL!, request.url));
    case "admin":
      return NextResponse.redirect(new URL(process.env.NEXT_PUBLIC_ADMIN_URL!, request.url));
    default:
      return NextResponse.redirect(new URL("/", request.url));
  }    
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
    "/"
  ]
}
