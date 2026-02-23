import { fetchFredSeries } from "../data/fred";
import { generateMacroSummary, generateMacroDeepAnalysis } from "../llm/macroNarrative";
import { getCache, setCache } from "../utils/cache";

export type InflationOutput = {
  headlineYoY: number | null;
  coreYoY: number | null;
  coreMomentum: number | null;
  breakeven5y: number | null;
  regime: string;
  score: number;
  series: number[];
  summary: string;       // short public summary
  deepAnalysis: string;  // detailed subscriber analysis
};

//
// ------------------------------
// Helpers
// ------------------------------

function buildCacheKey(
  coreYoY: number | null,
  momentum: number | null,
  breakeven: number | null,
  regime: string,
  type: "summary" | "deep"
) {
  return `inflation-${type}-${coreYoY}-${momentum}-${breakeven}-${regime}`;
}

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

  // Structural level
  if (coreYoY > 4) score += 1;
  if (coreYoY < 2) score -= 1;

  // Short-term momentum
  if (momentum != null) {
    if (momentum > 0.3) score += 0.5;
    if (momentum < -0.3) score -= 0.5;
  }

  // Market expectations
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

//
// ------------------------------
// Deterministic Public Summary
// ------------------------------

function deterministicSummary(
  coreYoY: number | null,
  momentum: number | null,
  breakeven: number | null
): string {
  if (coreYoY == null) {
    return "Inflation data is currently unavailable.";
  }

  let level =
    coreYoY > 4
      ? "Core inflation remains elevated relative to policy targets."
      : coreYoY < 2
      ? "Core inflation is running below traditional target levels."
      : "Core inflation is broadly aligned with policy targets.";

  let momentumComment =
    momentum == null
      ? ""
      : momentum > 0.3
      ? "Short-term price momentum is accelerating."
      : momentum < -0.3
      ? "Short-term price momentum is easing."
      : "Short-term price momentum remains stable.";

  let expectations =
    breakeven == null
      ? ""
      : breakeven > 3
      ? "Market-based expectations imply elevated forward inflation risk."
      : breakeven < 2
      ? "Market expectations remain contained."
      : "Market expectations are anchored near long-term norms.";

  return `${level} ${momentumComment} ${expectations}`.trim();
}

//
// ------------------------------
// Deterministic Deep Analysis
// ------------------------------

function deterministicDeepAnalysis(
  headlineYoY: number | null,
  coreYoY: number | null,
  momentum: number | null,
  breakeven: number | null,
  regime: string
): string {
  if (coreYoY == null) {
    return "Inflation data is unavailable at this time.";
  }

  return `
Current headline inflation stands at ${headlineYoY?.toFixed(1) ?? "N/A"}%, 
with core inflation at ${coreYoY?.toFixed(1) ?? "N/A"}%. 

Short-term momentum over the past three months measures 
${momentum?.toFixed(2) ?? "N/A"}%, indicating ${
    momentum != null
      ? momentum > 0.3
        ? "renewed upward pressure in price dynamics."
        : momentum < -0.3
        ? "a moderation in underlying price pressures."
        : "relative stability in near-term price movements."
      : "limited short-term directional clarity."
  }

Market-based five-year breakeven inflation currently sits at 
${breakeven?.toFixed(2) ?? "N/A"}%, suggesting ${
    breakeven != null
      ? breakeven > 3
        ? "investors are pricing elevated inflation expectations."
        : breakeven < 2
        ? "investors expect contained inflation ahead."
        : "expectations remain broadly anchored."
      : "insufficient forward-looking data."
  }

Overall, the inflation regime is classified as "${regime}". 
This assessment reflects both structural price levels and forward-looking market signals.
`.trim();
}

//
// ------------------------------
// Main Engine
// ------------------------------

export async function computeInflation(): Promise<InflationOutput> {
  try {
    const headlineRaw = await fetchFredSeries("CPIAUCSL&units=pc1");
    const coreRaw = await fetchFredSeries("CPILFESL&units=pc1");
    const breakevenRaw = await fetchFredSeries("T5YIE");

    const headlineSeries = headlineRaw.map((r) => r.value);
    const coreSeries = coreRaw.map((r) => r.value);
    const breakevenSeries = breakevenRaw.map((r) => r.value);

    const headlineYoY = headlineSeries.at(-1) ?? null;
    const coreYoY = coreSeries.at(-1) ?? null;
    const coreMomentum = computeMomentum(coreSeries);
    const breakeven5y = breakevenSeries.at(-1) ?? null;

    const score = scoreInflation(coreYoY, coreMomentum, breakeven5y);
    const regime = classify(score);

    // ------------------------------
    // Public Summary
    // ------------------------------

    let summary = deterministicSummary(
      coreYoY,
      coreMomentum,
      breakeven5y
    );

    try {
      const llmSummary = await generateMacroSummary({
        headlineYoY,
        coreYoY,
        momentum: coreMomentum,
        breakeven5y,
        regime,
      });

      if (llmSummary) summary = llmSummary;
    } catch {
      // fallback silently
    }

    // ------------------------------
    // Deep Analysis
    // ------------------------------

    let deepAnalysis = deterministicDeepAnalysis(
      headlineYoY,
      coreYoY,
      coreMomentum,
      breakeven5y,
      regime
    );

    try {
      const llmDeep = await generateMacroDeepAnalysis({
        headlineYoY,
        coreYoY,
        momentum: coreMomentum,
        breakeven5y,
        regime,
      });

      if (llmDeep) deepAnalysis = llmDeep;
    } catch {
      // fallback silently
    }

    return {
      headlineYoY,
      coreYoY,
      coreMomentum,
      breakeven5y,
      regime,
      score,
      series: headlineSeries.slice(-24),
      summary,
      deepAnalysis,
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
      deepAnalysis: "Inflation data unavailable.",
    };
  }
}