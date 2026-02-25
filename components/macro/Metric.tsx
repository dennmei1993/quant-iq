import { NullableNumber } from "@/lib/types";
import { getMacroTextColor } from "@/lib/ui";

export default function Metric({
  value,
  decimals,
  label,
  score,
}: {
  value: NullableNumber;
  decimals: number;
  label: string;
  score: number;
}) {
  return (
    <div>
      <p className={`text-xl font-semibold ${getMacroTextColor(score)}`}>
        {typeof value === "number" ? value.toFixed(decimals) : "N/A"}%
      </p>
      <p className="text-xs text-gray-500">{label}</p>
    </div>
  );
}