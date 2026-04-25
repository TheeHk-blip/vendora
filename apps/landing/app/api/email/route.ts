import { contactVendora } from "@vendora/ui/src/actions/mail";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { name, email, subject, body } = await req.json();
  try {
    await contactVendora(name, email, subject, body);
    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error("Internal server error:", error);
    console.log("Internal Server Error:", error)
  }
}