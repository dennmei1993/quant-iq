import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabaseServer";

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    const normalized = email?.toLowerCase().trim();

    if (!normalized || !isValidEmail(normalized)) {
      return NextResponse.json(
        { error: "Invalid email" },
        { status: 400 }
      );
    }

    // ✅ Instantiate client
    const supabase = getSupabaseServer();

    const { error } = await supabase
      .from("waitlist")
      .insert([{ email: normalized }]);

    if (error?.code === "23505") {
      return NextResponse.json(
        { message: "Already on waitlist" },
        { status: 200 }
      );
    }

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true },
      { status: 201 }
    );

  } catch {
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}