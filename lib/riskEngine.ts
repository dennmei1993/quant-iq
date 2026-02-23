import { computeInflation } from "./modules/inflation";

export type RiskCategory = {
  slug: string;
  label: string;
  status: string;
  summary: string;
  trend: number[];
  score: number;
  meta?: Record<string, number | null>;
};

export type RiskState = {
  regime: string;
  score: number; // -4 to +4 composite
  categories: RiskCategory[];
  lastUpdated: string;
};

function deriveRegime(score: number): string {
  if (score <= -2) return "Defensive Bias";
  if (score >= 2) return "Expansionary Bias";
  return "Neutral";
}

export async function getRiskState(): Promise<RiskState> {
  // ---- Module Computations ----
  const inflation = await computeInflation();

  // ---- Category Mapping ----
  const categories: RiskCategory[] = [
    {
      slug: "inflation",
      label: "Inflation",
      status: inflation.regime,
      summary: inflation.summary,
      trend: inflation.series,
      score: inflation.score,
      meta: {
        headline: inflation.headlineYoY,
        core: inflation.coreYoY,
        momentum: inflation.coreMomentum,
        breakeven: inflation.breakeven5y,
      }
    },
    // Placeholder modules (replace next)
    {
      slug: "rates",
      label: "Interest Rates",
      status: "Elevated",
      summary: "Policy rates remain above neutral levels.",
      trend: [0.5, 0.75, 1.5, 2.5, 3.5, 4.25, 4.5, 4.5],
      score: 1,
    },
    {
      slug: "growth",
      label: "Growth",
      status: "Slowing",
      summary: "Leading indicators moderating.",
      trend: [55, 54, 53, 52, 50, 49, 48, 47],
      score: -1,
    },
    {
      slug: "market",
      label: "Market Conditions",
      status: "Cautious",
      summary: "Volatility above median levels.",
      trend: [15, 16, 18, 22, 28, 24, 21, 19],
      score: -1,
    },
    {
      slug: "geopolitics",
      label: "Key Events",
      status: "Moderate",
      summary: "Structural geopolitical developments.",
      trend: [1, 1, 2, 2, 3, 3, 2, 2],
      score: 0,
    },
  ];

  // ---- Composite Score ----
  const compositeScore = categories.reduce(
    (sum, c) => sum + c.score,
    0
  );

  // Clamp composite to [-4, +4]
  const clampedScore = Math.max(-4, Math.min(4, compositeScore));

  const regime = deriveRegime(clampedScore);

  return {
    regime,
    score: clampedScore,
    categories,
    lastUpdated: new Date().toISOString(),
  };
}