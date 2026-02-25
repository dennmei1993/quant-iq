import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { fetchBlsSeries } from "../lib/data/bls";
import { fetchFredSeries } from "../lib/data/fred";
import { getSupabaseServer } from "../lib/supabaseServer";
import {
  generateMacroSummary,
  generateMacroDeepAnalysis,
  MacroInput
} from "../lib/llm/macroNarrative";

/* =====================================================
   CONFIG
===================================================== */
// const TEST_MONTHS = 3; // ⬅ fast-track testing window

const SIGNAL_TYPE = "inflation";

const MODEL_VERSION = "gpt-4.1-mini";
const PROMPT_VERSION = "inflation-v3.0";
const SCORING_VERSION = "inflation-v2.2";

const HISTORY_WINDOW = 24;
const LLM_DELAY_MS = 800;

const HEADLINE_LLM_YEARS = 5;
const DEEP_LLM_MONTHS = 24;

/* =====================================================
   UTILS
===================================================== */

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function computeYoY(series: number[], i: number): number | null {
    if (i < 12) return null;

    const current = series[i];
    const prior = series[i - 12];

    if (
      current == null ||
      prior == null ||
      !Number.isFinite(current) ||
      !Number.isFinite(prior) ||
      prior === 0
    ) {
      return null;
    }

    return Math.round(((current - prior) / prior) * 100 * 100) / 100;
  }

function compute3MAnnualized(series: number[], i: number): number | null {
    if (i < 3) return null;

    const current = series[i];
    const prior = series[i - 3];

    if (
      current == null ||
      prior == null ||
      !Number.isFinite(current) ||
      !Number.isFinite(prior) ||
      prior === 0
    ) {
      return null;
    }

    const annualized = (Math.pow(current / prior, 4) - 1) * 100;

    return Math.round(annualized * 100) / 100;
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

function getWindow<T>(series: T[], i: number) {
  return series.slice(Math.max(0, i - (HISTORY_WINDOW - 1)), i + 1);
}

async function fetchFullBlsSeries(seriesId: string) {
  const start = 1957;
  const end = new Date().getFullYear();
  const chunkSize = 10;

  let results: { date: string; value: number }[] = [];

  for (let year = start; year <= end; year += chunkSize) {
    const chunkEnd = Math.min(year + chunkSize - 1, end);
    console.log(`Fetching BLS ${seriesId}: ${year}-${chunkEnd}`);
    const data = await fetchBlsSeries(
      seriesId,
      year.toString(),
      chunkEnd.toString()
    );
    results = results.concat(data);
  }

  return results;
}

/* =====================================================
   MAIN
===================================================== */

async function run() {
  const supabase = getSupabaseServer();

  console.log("Fetching CPI history...");

  const headlineRaw = await fetchFullBlsSeries("CUUR0000SA0");
  const coreRaw = await fetchFullBlsSeries("CUUR0000SA0L1E");

  console.log("Fetching FRED T5YIE (daily breakeven)...");
  const breakevenRaw = await fetchFredSeries("T5YIE");
  
  // Convert daily breakeven into monthly average
  const breakevenMonthly = new Map<string, number>();

  const monthlyAccumulator = new Map<string, number[]>();

  for (const obs of breakevenRaw) {
    const monthKey = obs.date.slice(0, 7); // YYYY-MM

    if (!monthlyAccumulator.has(monthKey)) {
      monthlyAccumulator.set(monthKey, []);
    }

    monthlyAccumulator.get(monthKey)!.push(obs.value);
  }

  // Compute monthly average
  for (const [month, values] of monthlyAccumulator.entries()) {
    const avg =
      values.reduce((sum, v) => sum + v, 0) / values.length;

    breakevenMonthly.set(month, Math.round(avg * 100) / 100);
  }

  const headlineMap = new Map(
    headlineRaw
      .filter(d => Number.isFinite(d.value))
      .map(d => [d.date, d.value])
  );

  const coreMap = new Map(
    coreRaw
      .filter(d => Number.isFinite(d.value))
      .map(d => [d.date, d.value])
  );

  const dates = coreRaw
    .map(d => d.date)
    .filter(date => headlineMap.has(date))
    .sort();

  const headlineLevels = dates.map(d => headlineMap.get(d)!);
  const coreLevels = dates.map(d => coreMap.get(d)!);
  const breakevenSeries = dates.map(d => {
    const monthKey = d.slice(0, 7);
    return breakevenMonthly.get(monthKey) ?? null;
  });

  const headlineYoYSeries = headlineLevels.map((_, i) =>
    computeYoY(headlineLevels, i)
  );

  const coreYoYSeries = coreLevels.map((_, i) =>
    computeYoY(coreLevels, i)
  );

  const now = new Date();
  const headlineCutoff = new Date();
  headlineCutoff.setFullYear(now.getFullYear() - HEADLINE_LLM_YEARS);

  const deepCutoff = new Date();
  deepCutoff.setMonth(now.getMonth() - DEEP_LLM_MONTHS);

  let inserted = 0;

  // Only process last TEST_MONTHS
  // const startIndex = Math.max(0, dates.length - TEST_MONTHS);

  for (let i = 0; i < dates.length; i++) {
    const date = dates[i];
    const period = new Date(date.slice(0, 7) + "-01")
      .toISOString()
      .slice(0, 10);

    const headlineYoY = headlineYoYSeries[i];
    const coreYoY = coreYoYSeries[i];

    if (headlineYoY == null || coreYoY == null) continue;

    const momentum = compute3MAnnualized(coreLevels, i);

    /*
    if (i === dates.length - 1) {
      console.log("Latest coreLevels:", coreLevels.slice(-4));
      console.log("Latest momentum:", momentum);
    }
    */
    const breakeven5y = breakevenSeries[i];

    const score = scoreInflation(coreYoY, momentum, breakeven5y);
    const regime = classify(score);

    const periodDate = new Date(period);

    let narrativeHeadline = "Historical CPI regime data.";
    let narrativeDeep: any = null;

    const macroInput: MacroInput = {
      headlineYoY,
      coreYoY,
      momentum,
      breakeven5y,
      score,
      regime
    };

    if (periodDate >= headlineCutoff) {
      const summary = await generateMacroSummary(macroInput, {
        tone: "neutral"
      });
      narrativeHeadline = summary.headline;
      await sleep(LLM_DELAY_MS);
    }

    if (periodDate >= deepCutoff) {
      narrativeDeep = await generateMacroDeepAnalysis(macroInput, {
        tone: "neutral"
      });
      await sleep(LLM_DELAY_MS);
    }

    const structured = {
      indicators: {
        core_yoy: {
          current: coreYoY,
          history: getWindow(coreYoYSeries, i)
        },
        headline_yoy: {
          current: headlineYoY,
          history: getWindow(headlineYoYSeries, i)
        },
        breakeven_5y: {
          current: breakeven5y,
          history: getWindow(breakevenSeries, i)
        }
      },
      derived: {
        momentum,
        score,
        regime
      }
    };

    const { error } = await supabase
      .from("macro_signals")
      .insert({
        signal_type: SIGNAL_TYPE,
        period,
        structured,
        narrative_headline: narrativeHeadline,
        narrative_deep: narrativeDeep,
        model_version: MODEL_VERSION,
        prompt_version: PROMPT_VERSION,
        scoring_version: SCORING_VERSION
      });

    if (error) {
      console.error(`Insert failed for ${period}`, error);
      continue;
    }

    inserted++;
  }

  console.log(`Bootstrap complete. Inserted ${inserted} rows.`);
}

run().catch(err => {
  console.error("Bootstrap failed:", err);
});