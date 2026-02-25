export type NullableNumber = number | null;

export interface InflationMeta {
  headline: NullableNumber;
  core: NullableNumber;
  breakeven: NullableNumber;
  momentum: NullableNumber;
}

export interface MacroCategory {
  slug: string;
  label: string;
  score: number;
  status: string;
  summary?: string;
  deepAnalysis?: string;
  meta?: InflationMeta;
}

export interface RiskCategory {
  slug: string;
  label: string;
  score: number;
  status: string;
  summary?: string;
  deepAnalysis?: string;
  meta?: Record<string, number | null>;
}

export interface RiskState {
  regime: string;
  score: number;
  lastUpdated: string;
  categories: RiskCategory[];
}