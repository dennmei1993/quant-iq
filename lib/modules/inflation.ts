import { fetchFredSeries } from "../data/fred";
import { getSupabaseServer  } from "../supabaseServer";
import { generateMacroSummary, generateMacroDeepAnalysis } from "../llm/macroNarrative";

export type DeepInflationAnalysis = {
  drivers?: string;
  stocks?: string;
  bonds?: string;
  gold?: string;
  silver?: string;
  oil?: string;
  regimeShiftRisk?: string;
};

export type InflationOutput = {
  headlineYoY: number | null;
  coreYoY: number | null;
  coreMomentum: number | null;
  breakeven5y: number | null;
  regime: string;
  score: number;
  series: number[];
  summary: string;
  deepAnalysis: DeepInflationAnalysis | null;
};

// ------------------------------
// Helpers (UNCHANGED)
// ------------------------------

function computeMomentum(series: number[]): number | null {
  if (series.length < 4) return null;
  const latest = series.at(-1);
  const threeMonthsAgo = series.at(-4);
  if (latest == null || threeMonthsAgo == null) return null;
  return latest - threeMonthsAgo;
}

function scoreInflation(
  coreYoY: number | null,
  momentum: number | null,
  breakeven: number | null
): number {
  if (coreYoY == null) return 0;

  let score = 0;
  if (coreYoY > 4) score += 1;
  if (coreYoY < 2) score -= 1;

  if (momentum != null) {
    if (momentum > 0.3) score += 0.5;
    if (momentum < -0.3) score -= 0.5;
  }

  if (breakeven != null) {
    if (breakeven > 3) score += 0.5;
    if (breakeven < 2) score -= 0.5;
  }

  return Math.max(-2, Math.min(2, score));
}

function classify(score: number): string {
  if (score >= 1) return "Inflationary Pressure";
  if (score <= -1) return "Disinflationary";
  return "Neutral";
}

// ------------------------------
// Production Engine
// ------------------------------

export async function computeInflation(): Promise<InflationOutput> {
  try {
    // -------------------------------------------------
    // 1️⃣ Create server-side Supabase client (per request)
    // -------------------------------------------------

    const supabase = getSupabaseServer();

    const { data: stored, error } = await supabase
      .from("macro_signals")
      .select("*")
      .eq("signal_type", "inflation")
      .order("period", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error("Supabase fetch error:", error);
    }

    if (stored) {

      const s = stored.structured ?? {};

      const headlineYoY =
        s?.indicators?.headline_yoy?.current ?? null;

      const coreYoY =
        s?.indicators?.core_yoy?.current ?? null;

      const breakeven5y =
        s?.indicators?.breakeven_5y?.current ?? null;

      const coreMomentum =
        s?.derived?.momentum ?? null;

      const regime =
        s?.derived?.regime ?? "Unknown";

      const score =
        s?.derived?.score ?? 0;

      const series =
        s?.indicators?.headline_yoy?.history ?? [];

      return {
        headlineYoY,
        coreYoY,
        coreMomentum,
        breakeven5y,
        regime,
        score,
        series,
        summary: stored.narrative_headline ?? "",
        deepAnalysis: stored.narrative_deep ?? null,
      };
    }

   // Fallback: fetch raw levels and compute YoY manually

  const headlineRaw = await fetchFredSeries("CPIAUCSL");
  const coreRaw = await fetchFredSeries("CPILFESL");
  const breakevenRaw = await fetchFredSeries("T5YIE");

  const headlineLevels = headlineRaw.map(r => r.value);
  const coreLevels = coreRaw.map(r => r.value);
  const breakevenSeries = breakevenRaw.map(r => r.value);

  function computeYoY(series: number[]): number | null {
    if (series.length < 13) return null;
    const latest = series.at(-1)!;
    const prior = series.at(-13)!;
    return ((latest - prior) / prior) * 100;
  }

  const headlineYoY = computeYoY(headlineLevels);
  const coreYoY = computeYoY(coreLevels);
  const coreMomentum = computeMomentum(coreLevels);
  const breakeven5y = breakevenSeries.at(-1) ?? null;

  const score = scoreInflation(coreYoY, coreMomentum, breakeven5y);
  const regime = classify(score);

  return {
    headlineYoY,
    coreYoY,
    coreMomentum,
    breakeven5y,
    regime,
    score,
    series: coreLevels.slice(-24),
    summary: `Core inflation at ${coreYoY?.toFixed(1)}%. Regime: ${regime}.`,
    deepAnalysis: null,
  };
  } catch (error) {
    console.error("Inflation module error:", error);

    return {
      headlineYoY: null,
      coreYoY: null,
      coreMomentum: null,
      breakeven5y: null,
      regime: "Data Unavailable",
      score: 0,
      series: [],
      summary: "Inflation data unavailable.",
      deepAnalysis: null
    };
  }
}