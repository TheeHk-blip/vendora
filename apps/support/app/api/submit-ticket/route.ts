import { NextResponse } from "next/server";
import { connectDB, SupportTicket } from "@vendora/db";

export async function POST(req: Request) {
  const { title, description, userId, userRole } = await req.json();

  try {
    await connectDB();
    const ticket = await SupportTicket.create({
      title: title,
      description: description,
      userId: userId,
      userRole: userRole
    });

    return NextResponse.json({ ticket, success: true }, { status: 200 })
  } catch (error) {
    console.error("Failed to submit ticket", error);
    return NextResponse.json({ error: "Failed to submit ticket"}, { status: 400 });
  }
}