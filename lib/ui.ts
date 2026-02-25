export function getMacroTextColor(score: number) {
  if (score >= 1) return "text-red-600";
  if (score <= -1) return "text-blue-600";
  return "text-gray-900";
}

export function getMacroBg(score: number) {
  if (score >= 1) return "bg-red-50";
  if (score <= -1) return "bg-blue-50";
  return "bg-gray-50";
}

export function normalizeScore(score: number) {
  const clamped = Math.max(-4, Math.min(4, score));
  return ((clamped + 4) / 8) * 100;
}