export const RiskLevel = {
  Low: "low",
  Neutral: "neutral",
  High: "high",
} as const;

export type RiskLevel = typeof RiskLevel[keyof typeof RiskLevel];
export type NullableNumber = number | null;

export interface RiskState {
  regime: RiskLevel;
  score: number;
  categories: RiskCategory[];
  lastUpdated: string;
}

export interface InflationMeta {
  headline: number | null;
  core: number | null;
  breakeven: number | null;
  momentum: number | null;
}

export interface KeyEventMeta {
  deep?: {
    events: {
      headline: string;
      analysis: string;
      impact_tone: string;
      impact_score: number;
      importance: number;
    }[];
    aggregate?: {
      avg_score: number;
      tone: string;
    };
  };
}

export type MacroMeta =
  | InflationMeta
  | KeyEventMeta
  | undefined;

export interface RiskCategory {
  slug: string;
  label: string;
  state: RiskLevel;
  summary?: string;
  trend?: number[];
  score: number;
  meta?: MacroMeta;
}