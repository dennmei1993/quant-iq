import { computeInflation } from "./modules/inflation";
import { RiskLevel } from "./types";
import type { RiskCategory, RiskState } from "./types";

/**
 * Converts composite score into macro regime
 */
function deriveRegime(score: number): RiskLevel {
  if (score <= -2) return RiskLevel.Low;
  if (score >= 2) return RiskLevel.High;
  return RiskLevel.Neutral;
}

/**
 * Computes full macro risk state snapshot
 */
export async function getRiskState(): Promise<RiskState> {
  const inflation = await computeInflation();

  const categories: RiskCategory[] = [
    {
      slug: "inflation",
      label: "Inflation",
      state: inflation.score >= 2
        ? RiskLevel.High
        : inflation.score <= -2
        ? RiskLevel.Low
        : RiskLevel.Neutral,
      summary: inflation.summary,
      trend: inflation.series,
      score: inflation.score,
      meta: {
        headline: inflation.headlineYoY ?? 0,
        core: inflation.coreYoY ?? 0,
        momentum: inflation.coreMomentum ?? 0,
        breakeven: inflation.breakeven5y ?? 0,
      },
    },
    {
      slug: "rates",
      label: "Interest Rates",
      state: RiskLevel.High,
      summary: "Policy rates remain above neutral levels.",
      trend: [0.5, 0.75, 1.5, 2.5, 3.5, 4.25, 4.5, 4.5],
      score: 1,
    },
    {
      slug: "growth",
      label: "Growth",
      state: RiskLevel.Neutral,
      summary: "Leading indicators moderating.",
      trend: [55, 54, 53, 52, 50, 49, 48, 47],
      score: -1,
    },
    {
      slug: "market",
      label: "Market Conditions",
      state: RiskLevel.Neutral,
      summary: "Volatility above median levels.",
      trend: [15, 16, 18, 22, 28, 24, 21, 19],
      score: -1,
    },
    {
      slug: "geopolitics",
      label: "Key Events",
      state: RiskLevel.Neutral,
      summary: "Structural geopolitical developments.",
      trend: [1, 1, 2, 2, 3, 3, 2, 2],
      score: 0,
    },
  ];

  const compositeScore = categories.reduce(
    (sum, category) => sum + category.score,
    0
  );

  const clampedScore = Math.max(-4, Math.min(4, compositeScore));
  const regime = deriveRegime(clampedScore);

  return {
    regime,
    score: clampedScore,
    categories,
    lastUpdated: new Date().toISOString(),
  };
}