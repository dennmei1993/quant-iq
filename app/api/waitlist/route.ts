import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { email } = await req.json();

  console.log("New email:", email);

  return NextResponse.json({ success: true });
}