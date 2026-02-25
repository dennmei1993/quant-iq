import { RiskLevel } from "@/lib/types";
import type { RiskCategory } from "@/lib/types";
import { getMacroBg, getMacroTextColor } from "@/lib/ui";

export default function HomeInflationCard({
  inflation,
}: {
  inflation: RiskCategory;
}) {
  const {
    state: regime,
    meta,
    } = inflation;

    const headlineYoY = meta?.headline ?? null;
    const coreYoY = meta?.core ?? null;
    const breakeven5y = meta?.breakeven ?? null;

  return (
    <div className="rounded-xl shadow p-6 bg-white border">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Inflation</h2>

        <span
          className={`px-3 py-1 text-sm rounded-full ${getMacroBg(
            regime
          )} ${getMacroTextColor(regime)}`}
        >
          {regime.toUpperCase()}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-4 text-center">
        <Metric label="Headline YoY" value={headlineYoY} suffix="%" />
        <Metric label="Core YoY" value={coreYoY} suffix="%" />
        <Metric label="5Y Breakeven" value={breakeven5y} suffix="%" />
      </div>
    </div>
  );
}

function Metric({
  label,
  value,
  suffix,
}: {
  label: string;
  value: number | null;
  suffix?: string;
}) {
  return (
    <div>
      <div className="text-sm text-gray-500">{label}</div>
      <div className="text-lg font-semibold">
        {value != null ? value.toFixed(1) + (suffix ?? "") : "—"}
      </div>
    </div>
  );
}