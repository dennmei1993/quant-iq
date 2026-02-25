import type {
  RiskCategory,
  InflationMeta,
} from "./types";

export function mapRiskToMacro(
  category: RiskCategory
): RiskCategory {
  if (category.slug === "inflation" && category.meta) {
    const meta = category.meta;

    const inflationMeta: InflationMeta = {
      headline: meta.headline ?? null,
      core: meta.core ?? null,
      breakeven: meta.breakeven ?? null,
      momentum: meta.momentum ?? null,
    };

    return {
      ...category,
      meta: inflationMeta,
    };
  }

  return {
    ...category,
    meta: undefined,
  };
}