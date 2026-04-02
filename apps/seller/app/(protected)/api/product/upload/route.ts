import { NextResponse } from "next/server";
import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@vendora/auth";
import { del } from "@vercel/blob";

export async function POST(request: Request): Promise<NextResponse> {
  const body = (await request.json()) as HandleUploadBody;
  const session = await getServerSession(authOptions);
  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async () => {      
        if (session?.user.role !== "seller") throw new Error("unauthorized");
        return {
          allowedContentTypes: ["image/jpeg", "image/png", "image/webp"],
          tokenPayload: JSON.stringify({ userId: session.user._id}),
          maximumSizeInBytes: 2 * 1024 * 1024, // 2 MB
          addRandomSuffix: true
        };
      },
      onUploadCompleted: async ({ blob, tokenPayload }) => {
        console.log("blob upload complete", blob, tokenPayload);
      }
    });
    return NextResponse.json(jsonResponse);
  } catch (error) {
    return NextResponse.json(
      {error: (error as Error).message},
      {status: 400}
    )
  }
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const urlToDelete = searchParams.get("url");

  if (!urlToDelete) {
    return NextResponse.json({ error: "URL is required"}, { status: 400 });
  }

  try {
    const session = await getServerSession(authOptions);
    if (session?.user.role !=="seller") throw new Error("Unauthorized");
    await del(urlToDelete);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ "Delete failed": error }, { status: 500 });
  }
}