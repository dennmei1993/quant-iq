import { fetchFredSeries } from "../data/fred";
import { getSupabaseServer } from "../supabaseServer";
import { generateInflationSignal } from "../llm/inflationLLM";
import crypto from "crypto";

const SERIES_HEADLINE = "CPIAUCSL&units=pc1";
const SERIES_CORE = "CPILFESL&units=pc1";
const SERIES_BREAKEVEN = "T5YIE";
const PROMPT_VERSION = "v2.0.0";

function hash(data: object) {
  return crypto
    .createHash("sha256")
    .update(JSON.stringify(data))
    .digest("hex");
}

// ------------------------------
// Deterministic Metrics
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
// Main Job
// ------------------------------

export async function runInflationJob() {
  // 1️⃣ Fetch data
  const supabaseServer = getSupabaseServer();
  const headlineRaw = await fetchFredSeries(SERIES_HEADLINE);
  const coreRaw = await fetchFredSeries(SERIES_CORE);
  const breakevenRaw = await fetchFredSeries(SERIES_BREAKEVEN);

  const headlineSeries = headlineRaw.map((r) => r.value);
  const coreSeries = coreRaw.map((r) => r.value);
  const breakevenSeries = breakevenRaw.map((r) => r.value);

  const headlineYoY = headlineSeries.at(-1) ?? null;
  const coreYoY = coreSeries.at(-1) ?? null;
  const coreMomentum = computeMomentum(coreSeries);
  const breakeven5y = breakevenSeries.at(-1) ?? null;

  const score = scoreInflation(coreYoY, coreMomentum, breakeven5y);
  const regime = classify(score);

  const period = headlineRaw.at(-1)?.date;
  if (!period) throw new Error("No CPI date found.");

  const structured = {
    headlineYoY,
    coreYoY,
    coreMomentum,
    breakeven5y,
    score,
    regime
  };

  const dataHash = hash(structured);

  // 2️⃣ Check if exists
  const { data: existing } = await supabaseServer
    .from("macro_signals")
    .select("id")
    .eq("signal_type", "inflation")
    .eq("period", period)
    .eq("prompt_version", PROMPT_VERSION)
    .single();

  if (existing) {
    return { skipped: true };
  }

  // 3️⃣ LLM narrative generation
  const llmOutput = await generateInflationSignal(structured);

  // 4️⃣ Insert
  await supabaseServer.from("macro_signals").insert({
    signal_type: "inflation",
    country: "US",
    period,
    structured,
    narrative_summary: llmOutput.summary,
    narrative_deep: llmOutput.deep,
    series: headlineSeries.slice(-24),
    data_hash: dataHash,
    prompt_version: PROMPT_VERSION,
  });

  return { skipped: false };
}