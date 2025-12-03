import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";


export default async function proxy(request:NextRequest) {
  const token = await getToken({req: request, secret: process.env.NEXTAUTH_SECRET})

  if (!token) {
    return NextResponse.redirect(`${process.env.BASE_URL!}/signin`)
  }

  if (token.role !== "admin") {
    return NextResponse.redirect(new URL("/unauthorized", request.url))
  }
}