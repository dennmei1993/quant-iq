export const RiskLevel = {
  Low: "low",
  Neutral: "neutral",
  High: "high",
} as const;

export type RiskLevel = typeof RiskLevel[keyof typeof RiskLevel];
export type NullableNumber = number | null;

export type RiskCategory = {
  slug: string;
  label: string;
  state: RiskLevel;
  score: number;
  summary: string;
  deepAnalysis?: string;
  trend: number[];
  meta?: InflationMeta;
};

export interface RiskState {
  regime: RiskLevel;
  score: number;
  lastUpdated: string;
  categories: RiskCategory[];
}

export type InflationMeta = {
  headline: number | null;
  core: number | null;
  momentum: number | null;
  breakeven: number | null;
};