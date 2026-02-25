import { RiskLevel } from "@/lib/types";
import type { RiskLevel as RiskLevelType } from "@/lib/types";

export function getMacroTextColor(level: RiskLevelType): string {
  switch (level) {
    case RiskLevel.Low:
      return "text-green-700";
    case RiskLevel.High:
      return "text-red-700";
    default:
      return "text-yellow-700";
  }
}

export function getMacroBg(level: RiskLevelType): string {
  switch (level) {
    case RiskLevel.Low:
      return "bg-green-100";
    case RiskLevel.High:
      return "bg-red-100";
    default:
      return "bg-yellow-100";
  }
}


export function normalizeScore(score: number) {
  const clamped = Math.max(-4, Math.min(4, score));
  return ((clamped + 4) / 8) * 100;
}