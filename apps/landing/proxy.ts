import { geolocation } from "@vercel/functions";
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default async function proxy(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,   
  });

  const { pathname } = request.nextUrl;
  const { country } = geolocation(request);   

  const existingCurrency = request.cookies.get("user-currency");
  let currencyToSet = existingCurrency?.value

  if (!currencyToSet) {
    currencyToSet = country === "KE" ? "KES" : "KSH";
  }

  const redirectWithCookie = (destination:string) => {
    const url = new URL(destination, request.url);

    if (request.nextUrl.href === url.href) {
      return NextResponse.next();      
    }
    const response = NextResponse.redirect(url);
    response.cookies.set("user-currency", currencyToSet!, {
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
      sameSite: "lax",      
    }); 
    return response;
  }

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
      return redirectWithCookie(process.env.NEXT_PUBLIC_STORE_URL!);
    case "seller":
      return redirectWithCookie(process.env.NEXT_PUBLIC_SELLER_URL!);
    case "admin":
      return redirectWithCookie(process.env.NEXT_PUBLIC_ADMIN_URL!);
    default:
      return redirectWithCookie("/")
  }    
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
    "/"
  ]
}
