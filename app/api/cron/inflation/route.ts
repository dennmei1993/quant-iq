import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabaseServer";
import { fetchFredSeries } from "@/lib/data/fred";
import {
  generateMacroSummary,
  generateMacroDeepAnalysis,
} from "@/lib/llm/macroNarrative";
import {
  type MacroInput,
} from "@/lib/type/macro";

export async function GET(req: Request) {
  try {
    // 🔐 Authorization
    const authHeader = req.headers.get("authorization");
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = getSupabaseServer();

    // ---- Fetch CPI Data ----
    const headlineRaw = await fetchFredSeries("CPIAUCSL&units=pc1");
    const coreRaw = await fetchFredSeries("CPILFESL&units=pc1");
    const breakevenRaw = await fetchFredSeries("T5YIE");

    if (!headlineRaw.length || !coreRaw.length) {
      return NextResponse.json({ error: "No CPI data" }, { status: 400 });
    }

    // ---- Extract Series ----
    const headlineSeries = headlineRaw.map(r => r.value);
    const coreSeries = coreRaw.map(r => r.value);
    const breakevenSeries = breakevenRaw.map(r => r.value);

    const headlineYoY = headlineSeries.at(-1) ?? null;
    const coreYoY = coreSeries.at(-1) ?? null;
    const breakeven5y = breakevenSeries.at(-1) ?? null;

    // ---- Momentum (3-month delta) ----
    const momentum =
      coreSeries.length >= 4
        ? coreSeries.at(-1)! - coreSeries.at(-4)!
        : null;

    // ---- Derive Period (YYYY-MM) ----
    const period = headlineRaw.at(-1)?.date?.slice(0, 7);
    if (!period) {
      return NextResponse.json({ error: "Invalid CPI period" }, { status: 400 });
    }

    // ---- Idempotency Check ----
    const { data: existing } = await supabase
      .from("macro_signals")
      .select("id")
      .eq("signal_type", "inflation")
      .eq("period", period)
      .maybeSingle();

    if (existing) {
      return NextResponse.json({
        message: `Inflation already generated for ${period}`,
      });
    }

    // ---- Deterministic Score Logic ----
    let score = 0;
    if (coreYoY !== null) {
      if (coreYoY > 4) score += 1;
      if (coreYoY < 2) score -= 1;
    }

    if (momentum !== null) {
      if (momentum > 0.3) score += 0.5;
      if (momentum < -0.3) score -= 0.5;
    }

    if (breakeven5y !== null) {
      if (breakeven5y > 3) score += 0.5;
      if (breakeven5y < 2) score -= 0.5;
    }

    score = Math.max(-2, Math.min(2, score));

    const regime =
      score >= 1
        ? "Inflationary Pressure"
        : score <= -1
        ? "Disinflationary"
        : "Neutral";

    // ---- LLM Input (Strictly Typed) ----
    const macroInput: MacroInput = {
      headlineYoY,
      coreYoY,
      momentum,
      breakeven5y,
      score,
      regime,
    };

    // ---- OpenAI (Runs Once Per Period) ----
    const summary = await generateMacroSummary(macroInput);
    const deep = await generateMacroDeepAnalysis(macroInput);

    // ---- Insert Versioned Row ----
    const { error: insertError } = await supabase
      .from("macro_signals")
      .insert({
        signal_type: "inflation",
        period,
        structured: macroInput,
        narrative_summary: summary,
        narrative_deep: deep,
        model_version: "gpt-4.1-mini",
        scoring_version: "inflation-v1.0",
      });

    if (insertError) {
      console.error("Insert error:", insertError);
      return NextResponse.json(
        { error: "Database insert failed" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      period,
      score,
      regime,
    });

  } catch (error) {
    console.error("Cron inflation error:", error);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}