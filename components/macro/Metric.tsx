import { NullableNumber, RiskLevel } from "@/lib/types";
import { getMacroTextColor } from "@/lib/ui";

export function Metric({
  value,
  decimals,
  label,
  level,
}: {
  value: NullableNumber;
  decimals: number;
  label: string;
  level: RiskLevel;
}) {
  return (
    <div>
      <p className={`text-xl font-semibold ${getMacroTextColor(level)}`}>
        {typeof value === "number" ? value.toFixed(decimals) : "N/A"}%
      </p>
      <p className="text-xs text-gray-500">{label}</p>
    </div>
  );
}